# ⚡ INSTALLATION RAPIDE - MBOA ADMIN DASHBOARD

## 🎯 Pour tester LOCALEMENT (5 minutes)

### 1. Ouvrir le terminal dans le dossier
```bash
cd mboa-admin-dashboard
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le serveur
```bash
npm run dev
```

### 4. Ouvrir dans le navigateur
```
http://localhost:3000
```

### 5. Se connecter
- **Username:** admin
- **Password:** MboaAdmin2024!

**C'est tout ! Le dashboard est opérationnel. ✅**

---

## 🌐 Pour DÉPLOYER sur Vercel (10 minutes)

### Option A : Via le site Vercel (Plus simple)

1. Aller sur **https://vercel.com**
2. Se connecter avec GitHub
3. Cliquer **"Add New Project"**
4. Cliquer **"Import Git Repository"**
5. Si le repo n'existe pas encore :
   - Créer un nouveau repo sur GitHub
   - Uploader le dossier `mboa-admin-dashboard`
6. Dans Vercel, importer ce repo
7. Ajouter ces **Environment Variables** :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mgazqsuyugyjgfjygmvc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYXpxc3V5dWd5amdmanlnbXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODAwODMsImV4cCI6MjA3ODk1NjA4M30.Sr3KXylFOOWDh1Z5_D-_NekhlQamV2aRtNuNzmPdlmI
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYXpxc3V5dWd5amdmanlnbXZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM4MDA4MywiZXhwIjoyMDc4OTU2MDgzfQ.EtBstwp_sjAXzkAwzKUrvuHKzLbEYx7WvW4xxlKEuWw
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=MboaAdmin2024!
   ```
8. Cliquer **"Deploy"**
9. Attendre 2 minutes ⏱️
10. Votre dashboard est en ligne ! 🎉

**URL :** `https://votre-projet.vercel.app`

### Option B : Via la ligne de commande

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les instructions
```

---

## 🔐 SÉCURITÉ - À FAIRE AVANT LA PRODUCTION

⚠️ **IMPORTANT :** Modifier ces valeurs dans Vercel :

```
ADMIN_USERNAME=votre_nouveau_username
ADMIN_PASSWORD=UnMotDePasseTresFort2024!
```

---

## 🎨 UTILISATION

1. **Se connecter** avec vos credentials
2. **Consulter** la liste des KYC soumis
3. **Cliquer** sur "Voir détails" pour un KYC
4. **Vérifier** les informations et photos
5. **Approuver** ✅ ou **Rejeter** ❌

C'est tout ! 🎉

---

## 📞 BESOIN D'AIDE ?

- Lire le **README.md** complet pour plus de détails
- WhatsApp Business : **+237 621 055 365**

---

**Durée totale : 15 minutes max ⏱️**
