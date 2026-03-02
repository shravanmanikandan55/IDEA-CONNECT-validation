import express from "express";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const apiRouter = express.Router();

// Supabase Service Role Client (Private)
// Support both VITE_ prefixed and non-prefixed env variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase admin credentials missing. Server-side database operations will be disabled.");
}

const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Client for token verification (using anon key)
const supabaseVerify = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Setup Nodemailer (Ethereal for demo)
let transporter: nodemailer.Transporter | null = null;
async function getTransporter() {
  if (transporter) return transporter;
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("[MAIL] Ethereal test account created:", testAccount.user);
  } catch (err) {
    console.error("[MAIL] Failed to create test account, falling back to console logging:", err);
    transporter = {
      sendMail: async (mailOptions: any) => {
        console.log("[MAIL-SIM] Sending email:", mailOptions);
        return { messageId: "simulated-id" };
      }
    } as any;
  }
  return transporter as nodemailer.Transporter;
}

// API routes
apiRouter.post("/delete-account", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");
  
  if (!supabaseAdmin) {
    return res.status(503).json({ error: "Server-side database operations are disabled" });
  }

  try {
    const verifier = supabaseVerify || supabaseAdmin;
    if (!verifier) {
      return res.status(503).json({ error: "Verification service unavailable" });
    }

    const { data: { user }, error: authError } = await verifier.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Token verification failed:", authError);
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log(`Deleting account for user: ${user.id} (${user.email})`);

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      throw deleteError;
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get("/health", async (req, res) => {
  let dbStatus = "not_configured";
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('profiles').select('count', { count: 'exact', head: true });
      dbStatus = error ? `error: ${error.message}` : "connected";
    } catch (err: any) {
      dbStatus = `exception: ${err.message}`;
    }
  }
  res.json({ 
    status: "ok", 
    database: dbStatus,
    env: {
      hasUrl: !!process.env.VITE_SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
});

// Admin API: Get all users
apiRouter.get("/admin/users", async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase admin not configured" });
  }

  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(profiles);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin API: Get total idea count
apiRouter.get("/admin/ideas/count", async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase admin not configured" });
  }

  try {
    const { count, error } = await supabaseAdmin
      .from('ideas')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    res.json({ count });
  } catch (err: any) {
    console.error("Error fetching idea count:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin API: Get all ideas with author details
apiRouter.get("/admin/ideas", async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase admin not configured" });
  }

  try {
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (ideasError) throw ideasError;

    if (!ideas || ideas.length === 0) {
      return res.json([]);
    }

    const userIds = [...new Set(ideas.map((idea: any) => idea.user_id))];
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('user_id, full_name, company_name, email')
      .in('user_id', userIds);

    if (profilesError) throw profilesError;

    const profilesMap = new Map(profiles?.map((p: any) => [p.user_id, p]));
    
    const ideasWithProfiles = ideas.map((idea: any) => ({
      ...idea,
      profiles: profilesMap.get(idea.user_id) || null
    }));

    res.json(ideasWithProfiles);
  } catch (err: any) {
    console.error("Error fetching admin ideas:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin API: Delete an idea
apiRouter.delete("/admin/ideas/:id", async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase admin not configured" });
  }

  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting idea:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin API: Delete a user
apiRouter.delete("/admin/users/:id", async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase admin not configured" });
  }

  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin API: Update a user
apiRouter.patch("/admin/users/:id", async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase admin not configured" });
  }

  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      email: email,
      user_metadata: { full_name: name }
    });

    if (authError) throw authError;

    const profileType = role === 'Investor' ? 'company' : 'personal';
    const profileUpdate: any = {
      email: email,
      profile_type: profileType,
      updated_at: new Date().toISOString()
    };

    if (profileType === 'personal') {
      profileUpdate.full_name = name;
    } else {
      profileUpdate.company_name = name;
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdate)
      .eq('user_id', id);

    if (profileError) throw profileError;

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin API: Create a new user
apiRouter.post("/admin/users", async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase admin not configured" });
  }

  const { name, email, role } = req.body;

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    const profileType = role.toLowerCase() === 'company' ? 'company' : 'personal';
    
    const profileData: any = {
      user_id: authData.user.id,
      email: email,
      profile_type: profileType,
      updated_at: new Date().toISOString()
    };

    if (profileType === 'personal') {
      profileData.full_name = name;
    } else {
      profileData.company_name = name;
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData);

    if (profileError) throw profileError;

    res.json({ 
      success: true, 
      user: {
        id: authData.user.id,
        ...profileData
      }
    });
  } catch (err: any) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Public API: Get platform stats
apiRouter.get("/public/stats", async (req, res) => {
  if (!supabaseAdmin) {
    return res.json({ ideas: 2500, votes: 50000 });
  }

  try {
    const { count: ideaCount, error: ideaError } = await supabaseAdmin
      .from('ideas')
      .select('*', { count: 'exact', head: true });

    if (ideaError) throw ideaError;

    const { count: voteCount, error: voteError } = await supabaseAdmin
      .from('idea_votes')
      .select('*', { count: 'exact', head: true });

    if (voteError) throw voteError;

    res.json({ 
      ideas: ideaCount || 0, 
      votes: voteCount || 0 
    });
  } catch (err: any) {
    console.error("Error fetching public stats:", err);
    res.json({ ideas: 2500, votes: 50000 });
  }
});

// In-memory store for verification codes (for demo purposes)
const verificationCodes = new Map<string, { code: string; expires: number }>();

// API: Send custom verification code
apiRouter.post("/auth/send-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const code = Math.floor(10000000 + Math.random() * 90000000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  verificationCodes.set(email.toLowerCase(), { code, expires });

  console.log(`[AUTH] Verification code for ${email}: ${code}`);
  
  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail({
      from: '"IdeaConnect Auth" <auth@ideaconnect.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #4f46e5; text-align: center;">IdeaConnect</h2>
          <p>You requested a password reset. Please use the following 8-digit code to verify your identity:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; border-radius: 10px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[MAIL] Email sent! Preview URL: ${previewUrl}`);
    }
  } catch (mailError) {
    console.error("[MAIL] Failed to send email:", mailError);
  }
  
  res.json({ success: true, message: "Verification code sent to email (check server logs for demo)" });
});

// API: Verify custom code
apiRouter.post("/auth/verify-code", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

  const stored = verificationCodes.get(email.toLowerCase());
  if (!stored) return res.status(400).json({ error: "No code found for this email" });

  if (Date.now() > stored.expires) {
    verificationCodes.delete(email.toLowerCase());
    return res.status(400).json({ error: "Code has expired" });
  }

  if (stored.code !== code) {
    return res.status(400).json({ error: "Invalid verification code" });
  }

  res.json({ success: true });
});

// API: Update password using verified code
apiRouter.post("/auth/update-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Email, code, and new password are required" });
  }

  if (!supabaseAdmin) {
    return res.status(503).json({ error: "Server-side database operations are disabled" });
  }

  const stored = verificationCodes.get(email.toLowerCase());
  if (!stored || stored.code !== code || Date.now() > stored.expires) {
    return res.status(401).json({ error: "Unauthorized or expired session" });
  }

  try {
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('email', email.toLowerCase())
      .single();

    if (profileError || !profiles) {
      const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError || !data) throw listError || new Error("Failed to list users");
      
      const user = (data.users as any[]).find(u => u.email?.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword
      });

      if (updateError) throw updateError;
    } else {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profiles.user_id, {
        password: newPassword
      });

      if (updateError) throw updateError;
    }

    verificationCodes.delete(email.toLowerCase());

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: err.message });
  }
});
