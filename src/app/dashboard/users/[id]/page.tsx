"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function EditUserPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated" && params.id) {
      fetch("/api/users/" + params.id).then(r => r.json()).then(d => {
        if (d.user) { setName(d.user.name||""); setEmail(d.user.email||""); setRole(d.user.role||"user"); setIsActive(d.user.isActive); }
      });
    }
  }, [status, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const body: any = { name, email, role, isActive };
      if (password) body.password = password;
      const res = await fetch("/api/users/" + params.id, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) { setMessage("User updated!"); setTimeout(()=>router.push("/dashboard/users"),1000); }
      else { setError(data.error||"Failed"); }
    } catch (err) { setError("Network error"); }
    setLoading(false);
  };

  if (status === "loading") return <p style={{textAlign:"center",padding:"48px"}}>Loading...</p>;
  if (!session?.user || session.user.role !== "admin") return <p>Access denied</p>;

  const isDark = theme === "dark";
  const bg = isDark ? "#1f2937" : "white";
  const border = isDark ? "#374151" : "#e5e7eb";
  const text = isDark ? "#f9fafb" : "#111827";

  return (
    <div style={{maxWidth:"600px",margin:"0 auto"}}>
      <h1 style={{fontSize:"30px",fontWeight:"bold",color:text,marginBottom:"24px"}}>Edit User</h1>
      {error && <div style={{padding:"12px",background:"#fee2e2",color:"#991b1b",borderRadius:"8px",marginBottom:"16px"}}>{error}</div>}
      {message && <div style={{padding:"12px",background:"#d1fae5",color:"#065f46",borderRadius:"8px",marginBottom:"16px"}}>{message}</div>}
      <form onSubmit={handleSubmit} style={{background:bg,borderRadius:"8px",border:"1px solid "+border,padding:"24px"}}>
        <div style={{marginBottom:"16px"}}><label style={{display:"block",fontSize:"14px",fontWeight:"500",color:text,marginBottom:"4px"}}>Name</label><input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"8px 12px",border:"1px solid "+(isDark?"#4b5563":"#d1d5db"),borderRadius:"6px",background:isDark?"#374151":"white",color:text,boxSizing:"border-box"}} /></div>
        <div style={{marginBottom:"16px"}}><label style={{display:"block",fontSize:"14px",fontWeight:"500",color:text,marginBottom:"4px"}}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:"8px 12px",border:"1px solid "+(isDark?"#4b5563":"#d1d5db"),borderRadius:"6px",background:isDark?"#374151":"white",color:text,boxSizing:"border-box"}} /></div>
        <div style={{marginBottom:"16px"}}><label style={{display:"block",fontSize:"14px",fontWeight:"500",color:text,marginBottom:"4px"}}>New Password (leave blank to keep)</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:"8px 12px",border:"1px solid "+(isDark?"#4b5563":"#d1d5db"),borderRadius:"6px",background:isDark?"#374151":"white",color:text,boxSizing:"border-box"}} /></div>
        <div style={{marginBottom:"16px"}}><label style={{display:"block",fontSize:"14px",fontWeight:"500",color:text,marginBottom:"4px"}}>Role</label><select value={role} onChange={e=>setRole(e.target.value)} style={{width:"100%",padding:"8px 12px",border:"1px solid "+(isDark?"#4b5563":"#d1d5db"),borderRadius:"6px",background:isDark?"#374151":"white",color:text,boxSizing:"border-box"}}><option value="user">User</option><option value="moderator">Moderator</option><option value="admin">Admin</option></select></div>
        <div style={{marginBottom:"24px",display:"flex",alignItems:"center",gap:"12px"}}>
          <label style={{color:text,fontWeight:"500"}}>Active</label>
          <div onClick={()=>setIsActive(!isActive)} style={{width:"44px",height:"24px",borderRadius:"12px",background:isActive?"#10b981":"#6b7280",position:"relative",cursor:"pointer"}}><div style={{width:"20px",height:"20px",borderRadius:"50%",background:"white",position:"absolute",top:"2px",left:isActive?"22px":"2px",transition:"left 0.2s"}}></div></div>
        </div>
        <div style={{display:"flex",gap:"12px"}}>
          <button type="submit" disabled={loading} style={{flex:1,padding:"10px",background:loading?"#6b7280":"#3b82f6",color:"white",border:"none",borderRadius:"6px",fontWeight:"600",cursor:loading?"not-allowed":"pointer"}}>{loading?"Saving...":"Save Changes"}</button>
          <button type="button" onClick={()=>router.back()} style={{padding:"10px 20px",border:"1px solid "+(isDark?"#4b5563":"#d1d5db"),borderRadius:"6px",background:"transparent",color:text,cursor:"pointer"}}>Cancel</button>
        </div>
      </form>
    </div>
  );
}