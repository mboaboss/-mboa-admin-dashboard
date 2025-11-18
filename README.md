# 🎯 MBOA Admin Dashboard - Documentation Complète

Dashboard administrateur Next.js pour la gestion des KYC (Know Your Customer) de MBOA Wallet.

---

## 📋 CONTENU DU PROJET

```
mboa-admin-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/login/route.js      # API de connexion admin
│   │   └── kyc/
│   │       ├── list/route.js        # Liste tous les KYC
│   │       ├── approve/route.js     # Approuver un KYC
│   │       └── reject/route.js      # Rejeter un KYC
│   ├── dashboard/
│   │   └── page.js                  # Page principale du dashboard
│   ├── layout.js                    # Layout global
│   ├── page.js                      # Page de login
│   └── globals.css                  # Styles globaux
├── lib/
│   └── supabase.js                  # Configuration Supabase
├── .env.local                       # Variables d'environnement
├── .gitignore                       # Fichiers à ignorer
├── next.config.js                   # Configuration Next.js
├── package.json                     # Dépendances
├── postcss.config.js                # Configuration PostCSS
├── tailwind.config.js               # Configuration Tailwind CSS
└── README.md                        # Ce fichier
```

---

## 🚀 INSTALLATION LOCALE

### Prérequis
- Node.js 18+ installé
- npm ou yarn
- Compte Supabase avec projet configuré

### Étapes d'installation

1. **Extraire le dossier**
   ```bash
   # Le dossier complet est dans /mnt/user-data/outputs/mboa-admin-dashboard.zip
   unzip mboa-admin-dashboard.zip
   cd mboa-admin-dashboard
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Vérifier le fichier .env.local**
   Le fichier est déjà configuré avec vos clés Supabase :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://mgazqsuyugyjgfjygmvc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=MboaAdmin2024!
   ```

4. **Lancer en mode développement**
   ```bash
   npm run dev
   ```
   
   Le dashboard sera accessible sur : **http://localhost:3000**

5. **Connexion**
   - Username : `admin`
   - Password : `MboaAdmin2024!`

---

## 🌐 DÉPLOIEMENT SUR VERCEL (RECOMMANDÉ)

### Méthode 1 : Via GitHub (Recommandée)

1. **Créer un repo GitHub**
   ```bash
   cd mboa-admin-dashboard
   git init
   git add .
   git commit -m "Initial commit - MBOA Admin Dashboard"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/mboa-admin-dashboard.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Aller sur https://vercel.com
   - Cliquer "New Project"
   - Importer votre repo GitHub
   - Vercel détecte automatiquement Next.js ✅

3. **Configurer les variables d'environnement**
   Dans les settings du projet Vercel, ajouter :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mgazqsuyugyjgfjygmvc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=MboaAdmin2024!
   ```

4. **Déployer**
   - Cliquer "Deploy"
   - Attendre 2-3 minutes
   - Votre dashboard sera disponible sur : `https://votre-projet.vercel.app`

### Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les instructions
# Ajouter les variables d'environnement quand demandé
```

---

## 🏠 HÉBERGEMENT SUR HOSTINGER

### Option 1 : VPS Hostinger

Si vous avez un VPS avec Node.js :

1. **Se connecter au VPS via SSH**
   ```bash
   ssh root@votre-ip
   ```

2. **Installer Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt-get install -y nodejs
   ```

3. **Transférer le projet**
   ```bash
   # Sur votre machine locale
   scp -r mboa-admin-dashboard root@votre-ip:/var/www/
   ```

4. **Configurer et lancer**
   ```bash
   cd /var/www/mboa-admin-dashboard
   npm install
   npm run build
   
   # Installer PM2 pour garder l'app en ligne
   npm install -g pm2
   pm2 start npm --name "mboa-admin" -- start
   pm2 save
   pm2 startup
   ```

5. **Configurer Nginx**
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2 : Hébergement Web Classique

❌ **Non recommandé** - Les plans d'hébergement web classique de Hostinger ne supportent pas Next.js.

**Alternative :** Utilisez Vercel (gratuit et optimisé pour Next.js)

---

## 🔐 SÉCURITÉ

### ⚠️ IMPORTANT - En Production

1. **Changer les credentials admin**
   - Modifier `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans `.env.local`
   - Utiliser un mot de passe fort

2. **Utiliser JWT pour l'authentification**
   - Remplacer le système de token basique
   - Implémenter des tokens expirables

3. **Ajouter un rate limiting**
   - Limiter les tentatives de connexion
   - Protéger les API routes

4. **HTTPS obligatoire**
   - Vercel fournit HTTPS automatiquement ✅
   - Sur VPS : configurer Let's Encrypt

5. **Ne jamais commit .env.local**
   - Déjà dans `.gitignore` ✅
   - Utiliser les variables d'environnement Vercel

---

## 🎨 FONCTIONNALITÉS

### ✅ Actuellement disponibles

- 🔐 Authentification admin
- 📊 Dashboard avec statistiques
- 📋 Liste complète des KYC
- 🔍 Recherche par nom/wallet/téléphone
- 🏷️ Filtres par statut (pending/approved/rejected)
- 👁️ Visualisation détaillée de chaque KYC
- 📸 Affichage des 3 photos (ID, Selfie, Justificatif)
- ✅ Approbation en 1 clic
- ❌ Rejet avec motif obligatoire
- 🔄 Actualisation en temps réel
- 📱 Interface responsive (desktop/mobile)

### 🚀 Améliorations futures (optionnel)

- 📧 Notifications par email aux utilisateurs
- 📊 Graphiques d'évolution (Chart.js)
- 🔍 Export des données en CSV
- 👥 Gestion multi-admins avec rôles
- 📝 Historique complet des actions
- 🔔 Notifications push pour nouveaux KYC
- 🤖 Détection automatique de documents (OCR)
- 📊 Analytics avancées

---

## 🛠️ TECHNOLOGIES UTILISÉES

- **Framework :** Next.js 14 (App Router)
- **Styling :** Tailwind CSS 3.4
- **Base de données :** Supabase (PostgreSQL)
- **Storage :** Supabase Storage
- **Icons :** Lucide React
- **Date formatting :** date-fns
- **Déploiement :** Vercel (recommandé)

---

## 📱 UTILISATION

### Workflow complet

1. **Connexion admin**
   - Ouvrir le dashboard
   - Se connecter avec les credentials

2. **Consulter la liste**
   - Voir tous les KYC soumis
   - Utiliser les filtres (statut, recherche)
   - Consulter les statistiques en haut

3. **Examiner un KYC**
   - Cliquer sur "Voir détails"
   - Vérifier les informations personnelles
   - Visualiser les 3 photos en haute qualité
   - Télécharger les documents si nécessaire

4. **Approuver un KYC**
   - Cliquer "Approuver"
   - Confirmer
   - L'utilisateur peut maintenant trader dans l'app

5. **Rejeter un KYC**
   - Cliquer "Rejeter"
   - Entrer un motif clair
   - Confirmer
   - L'utilisateur verra le motif dans l'app

---

## 🐛 DÉPANNAGE

### Erreur : "Cannot read property of undefined"
**Cause :** Variables d'environnement manquantes  
**Solution :** Vérifier `.env.local` et redémarrer le serveur

### Images ne s'affichent pas
**Cause :** URLs Supabase bloquées  
**Solution :** Vérifier `next.config.js` et les permissions Storage dans Supabase

### Erreur 401 lors des approbations
**Cause :** Service Role Key incorrecte  
**Solution :** Régénérer la clé dans Supabase Dashboard

### "Module not found"
**Cause :** Dépendances non installées  
**Solution :**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 SUPPORT

**Projet :** MBOA Wallet - Admin Dashboard  
**Développeur :** MBOA GROUP SARL  
**WhatsApp Business :** +237 621 055 365  
**Supabase Project :** https://supabase.com/dashboard/project/mgazqsuyugyjgfjygmvc

---

## 📝 NOTES IMPORTANTES

### Base de données Supabase

Les policies actuelles permettent l'accès `anon` pour les soumissions KYC (car l'app mobile utilise la clé anon).

**Pour les mises à jour (approve/reject) :**
- Utiliser `service_role` key (fait ✅)
- Seul le dashboard admin peut modifier les statuts

### Performance

- Les images sont chargées via CDN Supabase (rapide)
- Le dashboard utilise des composants React optimisés
- Actualisation manuelle pour éviter le polling constant

---

## ✅ CHECKLIST FINALE

Avant de mettre en production :

- [ ] Modifier les credentials admin dans `.env.local`
- [ ] Déployer sur Vercel ou VPS
- [ ] Configurer HTTPS
- [ ] Tester le workflow complet (approve/reject)
- [ ] Vérifier que les images s'affichent correctement
- [ ] Configurer un domaine custom (optionnel)
- [ ] Ajouter un monitoring (Vercel Analytics)
- [ ] Former l'équipe admin sur l'utilisation

---

## 🎉 FÉLICITATIONS !

Votre dashboard admin MBOA Wallet est prêt à être utilisé ! 🚀

**Prochaine étape :** Tester avec de vrais utilisateurs et itérer selon les besoins.

---

**© 2024 MBOA GROUP SARL - Tous droits réservés**
