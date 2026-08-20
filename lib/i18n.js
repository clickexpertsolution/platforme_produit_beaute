// =============================================================================
// i18n — FR / EN / AR
// =============================================================================
// La plateforme était bilingue FR/EN via des ternaires `lang === 'fr' ? … : …`.
// L'arabe est ajouté comme troisième langue via un dictionnaire indexé sur la
// chaîne française (la source), pour ne pas avoir à inventer des clés.
//
// Mots-clés sans équivalent arabe (marques, INCI, noms de produits, sigles) :
// ils restent tels quels et sont rendus dans une pastille au fond plus foncé
// (.dz-kw, cf. globals.css). Dans le dictionnaire, on les balise `[[…]]`.
// =============================================================================

import { createElement, Fragment } from 'react'

export const LANGS = ['fr', 'en', 'ar']
export const LANG_LABEL = { fr: 'FR', en: 'EN', ar: 'ع' }
export const isRTL = (lang) => lang === 'ar'
// Locale de formatage des nombres : ar-DZ garde les chiffres latins (0-9),
// contrairement à ar-EG qui produit des chiffres arabes orientaux.
export const NUMBER_LOCALE = { fr: 'fr-FR', en: 'en-US', ar: 'ar-DZ' }

// Langue suivante dans le cycle du bouton de bascule du header.
export const nextLang = (lang) => LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]

// ---------------------------------------------------------------------------
// Métadonnées des langues pour le sélecteur du header.
//   code   : pastille courte affichée dans le déclencheur (FR / EN / ع)
//   native : nom de la langue dans sa propre langue (endonyme)
//   dir    : sens d'écriture de l'aperçu (pour rendre l'endonyme correctement)
//   label  : nom traduit de la langue, indexé sur la langue courante de l'UI
// ---------------------------------------------------------------------------
export const LANG_META = {
  fr: {
    code: 'FR',
    native: 'Français',
    dir: 'ltr',
    label: { fr: 'Français', en: 'French', ar: 'الفرنسية' },
  },
  en: {
    code: 'EN',
    native: 'English',
    dir: 'ltr',
    label: { fr: 'Anglais', en: 'English', ar: 'الإنجليزية' },
  },
  ar: {
    code: 'ع',
    native: 'العربية',
    dir: 'rtl',
    label: { fr: 'Arabe', en: 'Arabic', ar: 'العربية' },
  },
}

// ---------------------------------------------------------------------------
// Dictionnaire arabe, indexé sur la chaîne française.
// ---------------------------------------------------------------------------
export const AR = {
  // ---- Badges sécurité / preuves ----
  'Sûr': 'آمن',
  'Prudence': 'احذر',
  'Preuves solides': 'أدلة قوية',
  'Preuves modérées': 'أدلة متوسطة',
  'Preuves limitées': 'أدلة محدودة',

  // ---- Header / navigation ----
  'Produits': 'المنتجات',
  'Conseils': 'نصائح',
  'Ingrédients': 'المكوّنات',
  'Marques': 'العلامات التجارية',
  'Marques allemandes': 'علامات ألمانية',
  'Comparer': 'قارن',
  'Reels': 'ريلز',
  'Product Finder': 'اعثر على منتجك',
  'Back-office': 'لوحة التحكم',
  'min': 'دقيقة',
  'Email *': 'البريد الإلكتروني *',
  'Message': 'الرسالة',
  'Guides': 'أدلة',
  'Pour les marques': 'للعلامات التجارية',
  'Trouver mon produit': 'اعثر على منتجك',
  'Science': 'عِلم',
  'Menu': 'القائمة',
  'Changer de langue': 'تغيير اللغة',

  // ---- Recherche héro ----
  'Rechercher': 'بحث',
  'Un produit, un ingrédient, une préoccupation…': 'منتج، أو مكوّن، أو مشكلة…',
  'Lancer': 'ابحث',
  'Aucun résultat — appuyez sur Entrée pour lancer la recherche': 'لا توجد نتائج — اضغط [[Enter]] لبدء البحث',
  'Produit': 'منتج',
  'Ingrédient': 'مكوّن',
  'Préoccupation': 'المشكلة',
  'Marque': 'علامة تجارية',

  // ---- Accueil : héro ----
  'Skincare basé sur la science': 'عناية بالبشرة مبنية على العلم',
  'Comprenez enfin ce que vous mettez sur votre ': 'افهم أخيرًا ما تضعه على ',
  'peau': 'بشرتك',
  'Analysez les ingrédients, comparez les produits et trouvez la routine idéale — avec un focus unique sur les marques dermatologiques allemandes.':
    'حلّل المكوّنات، وقارن المنتجات، واعثر على الروتين المثالي — مع تركيز فريد على العلامات الألمانية المتخصّصة في طبّ الجلد.',
  'Populaire': 'الأكثر بحثًا',
  'Produits analysés': 'منتجات مُحلَّلة',
  'Ingrédients décryptés': 'مكوّنات مُفسَّرة',

  // ---- Accueil : préoccupations ----
  'Quelle est votre préoccupation ?': 'ما الذي يشغلك؟',
  'Trois univers, une même exigence scientifique': 'ثلاثة عوالم، ونفس الصرامة العلمية',
  'axes': 'محاور',
  'Acné, sensibilité, anti-âge, taches...': 'حبّ الشباب، الحساسية، مكافحة الشيخوخة، البقع...',
  'Chute, pellicules, cheveux abîmés...': 'تساقط الشعر، القشرة، الشعر التالف...',
  'Sommeil, stress, énergie, digestion...': 'النوم، التوتر، الطاقة، الهضم...',

  // ---- Accueil : sections ----
  'Produits en vedette': 'منتجات مختارة',
  'Les mieux notés par la communauté': 'الأعلى تقييمًا لدى المجتمع',
  'Tout voir': 'عرض الكل',
  'Ce que dit la science sur chaque actif': 'ما يقوله العلم عن كل مادة فعّالة',
  'Aucun ingrédient dans cette famille.': 'لا يوجد مكوّن في هذه العائلة.',
  'Dossier': 'ملف خاص',
  'L’excellence dermatologique allemande': 'التميّز الألماني في طبّ الجلد',
  'Plus de 100 ans de recherche et de rigueur scientifique.': 'أكثر من 100 عام من البحث والصرامة العلمية.',
  'Découvrir': 'اكتشف',
  'Derniers guides': 'أحدث الأدلة',
  'Apprenez à connaître votre peau': 'تعرّف على بشرتك عن قرب',
  'Vous êtes une marque ?': 'هل تمثّل علامة تجارية؟',
  'Faites analyser et référencer vos produits sur la plateforme de référence de la skincare transparente.':
    'اعرض منتجاتك للتحليل والإدراج على المنصّة المرجعية للعناية الشفّافة بالبشرة.',
  'Nous contacter': 'تواصل معنا',

  // ---- Reels ----
  'En 60 secondes': 'في 60 ثانية',
  'La science de la peau, format court': 'علم البشرة في مقاطع قصيرة',
  'Aucune vidéo publiée pour le moment.': 'لا توجد مقاطع منشورة حاليًا.',
  'source vidéo non reconnue': 'مصدر الفيديو غير معروف',
  'Voir le produit': 'عرض المنتج',
  "Voir l'ingrédient": 'عرض المكوّن',
  'Ouvrir la source': 'فتح المصدر',
  'Vidéo précédente': 'الفيديو السابق',
  'Vidéo suivante': 'الفيديو التالي',

  // ---- Liste produits ----
  'Tous les produits analysés par nos experts': 'كل المنتجات التي حلّلها خبراؤنا',
  'Rechercher un produit ou une marque...': 'ابحث عن منتج أو علامة تجارية...',
  'Catégorie': 'الفئة',
  'Type de peau': 'نوع البشرة',
  'Chargement...': 'جارٍ التحميل...',
  'Aucun produit trouvé.': 'لم يُعثر على أي منتج.',

  // ---- Fiche produit ----
  "Voir l'étude": 'عرض الدراسة',
  'International': 'دولي',
  'Retour aux produits': 'العودة إلى المنتجات',
  'Préoccupations ciblées': 'المشكلات المستهدفة',
  'Types de peau': 'أنواع البشرة',
  'Actifs clés': 'المواد الفعّالة الأساسية',
  'Certifications reconnues': 'شهادات معتمدة',
  'Labels & récompenses': 'العلامات والجوائز',
  'Études & preuves scientifiques': 'الدراسات والأدلة العلمية',
  'Sur le produit': 'حول المنتج',
  'Sur les ingrédients': 'حول المكوّنات',
  'Références fournies à titre informatif (démonstration).': 'المراجع مقدَّمة لغرض إعلامي (عرض توضيحي).',

  // ---- Ingrédients ----
  'Chaque actif évalué selon les preuves scientifiques': 'كل مادة فعّالة مُقيَّمة وفق الأدلة العلمية',
  'Retour aux ingrédients': 'العودة إلى المكوّنات',
  'Contexte réglementaire (UE / Allemagne)': 'الإطار التنظيمي ([[UE]] / ألمانيا)',
  'Bénéfices': 'الفوائد',
  'Profil': 'الملف',
  'Comédogénicité': 'احتمالية سدّ المسام',
  'Recommandé pour': 'موصى به لـ',
  'Produits contenant cet actif': 'منتجات تحتوي على هذه المادة الفعّالة',
  'Actif': 'مادة فعّالة',

  // ---- Marques ----
  "L'Allemagne est le berceau de la dermo-cosmétique moderne : pH physiologique, essais cliniques rigoureux, formules minimalistes. Découvrez les marques qui ont fait cette réputation.":
    'ألمانيا هي مهد مستحضرات التجميل الطبّية الحديثة: درجة حموضة فسيولوجية، وتجارب سريرية صارمة، وتركيبات بسيطة. اكتشف العلامات التي صنعت هذه السمعة.',
  'Les marques référencées sur la plateforme': 'العلامات المُدرجة على المنصّة',
  'depuis': 'منذ',
  'Retour aux marques': 'العودة إلى العلامات',
  'fondée en': 'تأسّست عام',
  'Site officiel': 'الموقع الرسمي',
  'Fabricant': 'الشركة المصنِّعة',
  'Certifications & engagements': 'الشهادات والالتزامات',
  'Produits de la marque': 'منتجات العلامة',

  // ---- Comparateur ----
  'Égalité': 'تعادل',
  'Comparez deux produits côte à côte, ingrédient par ingrédient': 'قارن منتجين جنبًا إلى جنب، مكوّنًا بمكوّن',
  'Comparateur': 'أداة المقارنة',
  'Choisir le produit A': 'اختر المنتج [[A]]',
  'Rechercher un produit…': 'ابحث عن منتج…',
  'Aucun produit': 'لا يوجد منتج',
  'Échanger': 'تبديل',
  "Choisissez d'abord le produit A": 'اختر المنتج [[A]] أوّلًا',
  'Choisir le produit B': 'اختر المنتج [[B]]',
  'Aucun produit de même catégorie': 'لا يوجد منتج من الفئة نفسها',
  'Comparaison limitée à la catégorie': 'المقارنة محصورة في فئة',
  'pour rester pertinente.': 'حتى تبقى ذات معنى.',
  'Sélectionnez deux produits pour lancer la comparaison.': 'اختر منتجين لبدء المقارنة.',
  'Produit introuvable.': 'المنتج غير موجود.',
  'Le moins cher': 'الأقلّ سعرًا',
  'Le mieux noté': 'الأعلى تقييمًا',
  'Le plus doux': 'الألطف على البشرة',
  'comédogénicité la plus basse': 'أقلّ احتمالية لسدّ المسام',
  'Meilleur rapport Q/P': 'أفضل قيمة مقابل السعر',
  'note / prix': 'التقييم / السعر',
  'Reset': 'إعادة ضبط',
  'Prix': 'السعر',
  'Note': 'التقييم',
  "Nb d'actifs": 'عدد المواد الفعّالة',
  'Origine': 'المنشأ',
  'Préoccupations': 'المشكلات',
  'Analyse des ingrédients': 'تحليل المكوّنات',
  'Communs': 'مشتركة',
  'Propres à': 'خاصّة بـ',
  'Partager cette comparaison': 'شارك هذه المقارنة',
  'Copié !': 'تم النسخ!',
  'Copier le lien': 'نسخ الرابط',

  // ---- Routine / Product Finder ----
  'Risque élevé': 'خطورة عالية',
  'Attention': 'تنبيه',
  "Aucun conflit d'actifs détecté dans cette routine": 'لم يُرصد أي تعارض بين المواد الفعّالة في هذا الروتين',
  'Total': 'الإجمالي',
  'Autres produits qui correspondent à votre profil': 'منتجات أخرى تناسب ملفك',
  'Ma routine skincare': 'روتين العناية ببشرتي',
  'Voici la routine que j’ai trouvée sur Dermalyze :': 'هذا هو الروتين الذي وجدته على [[Dermalyze]]:',
  'Partager ma routine': 'شارك روتيني',
  'Générez un lien unique et envoyez votre routine à vos amis.': 'أنشئ رابطًا فريدًا وأرسل روتينك إلى أصدقائك.',
  'Création du lien...': 'جارٍ إنشاء الرابط...',
  'Créer un lien de partage': 'إنشاء رابط مشاركة',
  'Copier': 'نسخ',
  'Impossible de créer le lien. Réessayez.': 'تعذّر إنشاء الرابط. حاول مرة أخرى.',
  'Chargement de la routine...': 'جارٍ تحميل الروتين...',
  'Routine introuvable': 'الروتين غير موجود',
  "Ce lien n'est plus valide ou a expiré.": 'لم يعد هذا الرابط صالحًا أو انتهت صلاحيته.',
  'Créer ma propre routine': 'أنشئ روتيني الخاص',
  'Économique': 'اقتصادي',
  'Modéré': 'متوسّط',
  'Routine partagée': 'روتين مُشارَك',
  'Une routine personnalisée a été partagée avec vous': 'تمّت مشاركة روتين مخصّص معك',
  'Peau': 'البشرة',
  'Budget': 'الميزانية',
  'Envie de votre propre routine ?': 'هل تريد روتينك الخاص؟',
  'Répondez à 3 questions et obtenez des recommandations personnalisées.': 'أجب عن 3 أسئلة واحصل على توصيات مخصّصة.',
  'Lancer le Product Finder': 'ابدأ البحث عن منتجك',
  'Trouvez vos produits idéaux': 'اعثر على منتجاتك المثالية',
  'Quelques questions, une routine personnalisée pour votre univers.': 'بضعة أسئلة، وروتين مخصّص لعالمك.',
  'Quel univers vous intéresse ?': 'أيّ عالم يهمّك؟',
  'Quel est votre type de peau ?': 'ما نوع بشرتك؟',
  'Retour': 'رجوع',
  'Quelles sont vos préoccupations ?': 'ما المشكلات التي تواجهها؟',
  'Plusieurs choix possibles': 'يمكن اختيار أكثر من إجابة',
  'Continuer': 'متابعة',
  'Quel est votre budget par produit ?': 'ما ميزانيتك لكلّ منتج؟',
  'Des ingrédients à éviter ?': 'هل هناك مكوّنات تريد تجنّبها؟',
  'Optionnel — nous exclurons les produits qui en contiennent': 'اختياري — سنستبعد المنتجات التي تحتوي عليها',
  'Voir ma routine': 'عرض روتيني',
  'Passer — voir ma routine': 'تخطَّ — عرض روتيني',
  'Construction de votre routine...': 'جارٍ بناء روتينك...',
  'Votre routine personnalisée': 'روتينك المخصّص',
  'Étape par étape, adaptée à votre profil.': 'خطوة بخطوة، مصمّم وفق ملفك.',
  'Recommencer le quiz': 'إعادة الاختبار',

  // ---- Newsletter / achat ----
  'Newsletter': 'النشرة البريدية',
  'Beauté & science, une fois par mois': 'الجمال والعلم، مرّة كلّ شهر',
  'Conseils fondés sur la science et nouvelles marques allemandes.': 'نصائح مبنية على العلم وأحدث العلامات الألمانية.',
  'Merci ! Vous êtes inscrit(e).': 'شكرًا! تمّ تسجيل اشتراكك.',
  'Votre email': 'بريدك الإلكتروني',
  'Envoi...': 'جارٍ الإرسال...',
  "S'inscrire": 'اشترك',
  'Email invalide, réessayez.': 'بريد إلكتروني غير صالح، حاول مرة أخرى.',
  'Où acheter': 'أين تشتري',

  // ---- Hubs / conseils ----
  'Comprendre votre problématique avant de choisir un produit': 'افهم مشكلتك قبل اختيار المنتج',
  'Conseils par préoccupation': 'نصائح حسب المشكلة',
  'Lire le guide complet': 'اقرأ الدليل الكامل',
  'Tous les conseils': 'كلّ النصائح',
  'Causes fréquentes': 'الأسباب الشائعة',
  'Erreurs à éviter': 'أخطاء يجب تجنّبها',
  'Les actifs qui ont fait leurs preuves': 'المواد الفعّالة التي أثبتت جدواها',
  "Guide d'achat": 'دليل الشراء',
  'Sélection triée par note de la communauté': 'اختيار مرتَّب حسب تقييم المجتمع',
  'Produits recommandés': 'منتجات موصى بها',
  'Questions fréquentes': 'الأسئلة الشائعة',
  'Ces informations sont éducatives et ne remplacent pas un avis médical. Consultez un professionnel de santé en cas de symptômes persistants.':
    'هذه المعلومات تثقيفية ولا تُغني عن استشارة طبّية. راجع أخصائي رعاية صحّية إذا استمرّت الأعراض.',

  // ---- Learn ----
  'Guides, décryptages et synthèses scientifiques': 'أدلّة وتحليلات وخلاصات علمية',
  'Learn & Guides': 'التعلّم والأدلّة',
  'Retour aux guides': 'العودة إلى الأدلّة',

  // ---- Espace marques ----
  'Veuillez remplir les champs requis.': 'يرجى ملء الحقول المطلوبة.',
  'Espace marques': 'فضاء العلامات',
  'Référencez vos produits sur Dermalyze': 'أدرج منتجاتك على [[Dermalyze]]',
  'Rejoignez la plateforme de référence de la skincare transparente. Nos analyses indépendantes mettent en valeur les formules honnêtes et efficaces.':
    'انضمّ إلى المنصّة المرجعية للعناية الشفّافة بالبشرة. تحليلاتنا المستقلّة تُبرز التركيبات الصادقة والفعّالة.',
  'Visibilité auprès d’une audience qualifiée': 'ظهور أمام جمهور مؤهَّل',
  'Analyses ingrédients basées sur la science': 'تحليلات للمكوّنات مبنية على العلم',
  'Liens d’achat et suivi des performances': 'روابط شراء وتتبّع للأداء',
  'Présence bilingue FR / EN': 'حضور متعدّد اللغات [[FR / EN / AR]]',
  'Message envoyé !': 'تمّ إرسال الرسالة!',
  'Notre équipe vous recontactera sous 48h.': 'سيعاود فريقنا التواصل معك خلال 48 ساعة.',
  'Nom de la marque *': 'اسم العلامة التجارية *',
  'Votre nom': 'اسمك',
  'Envoyer la demande': 'إرسال الطلب',

  // ---- Back-office ----
  'Supprimer cet élément ?': 'هل تريد حذف هذا العنصر؟',
  'éléments': 'عنصر',
  'Générer avec l’IA': 'توليد بالذكاء الاصطناعي',
  'Ajouter': 'إضافة',
  'Générer un article (IA)': 'توليد مقال (ذكاء اصطناعي)',
  'Sujet de l’article': 'موضوع المقال',
  'Ex : Comment utiliser la niacinamide': 'مثال: كيفية استخدام [[Niacinamide]]',
  'Univers': 'العالم',
  'Génération en cours… (10-20s)': 'جارٍ التوليد… (10-20 ثانية)',
  'Générer': 'توليد',
  'Le contenu généré s’ouvrira en brouillon pour révision avant publication.': 'سيُفتح المحتوى المُولَّد كمسوّدة للمراجعة قبل النشر.',
  'Modifier': 'تعديل',
  'Enregistrer': 'حفظ',
  'Mot de passe incorrect': 'كلمة المرور غير صحيحة',
  'Accès réservé à l’administration': 'دخول مخصّص للإدارة',
  'Mot de passe': 'كلمة المرور',
  'Connexion': 'تسجيل الدخول',
  'Déconnexion': 'تسجيل الخروج',
  'Abonnés': 'المشتركون',
  'Aucun lead pour le moment.': 'لا توجد طلبات حاليًا.',
  'Exporter CSV': 'تصدير [[CSV]]',
  'Aucun abonné pour le moment.': 'لا يوجد مشتركون حاليًا.',
  'Source': 'المصدر',
  'Articles': 'مقالات',
  'Hubs': 'المراكز',
  'Leads': 'الطلبات',
  'Clics achat': 'نقرات الشراء',
  'Oui': 'نعم',
  'Non': 'لا',

  // ---- Footer ----
  'Explorer': 'استكشف',
  'Outils': 'أدوات',
  'Professionnels': 'للمحترفين',
  'La skincare décryptée par la science. Indépendant, transparent, bilingue.':
    'العناية بالبشرة مُفسَّرة بالعلم. مستقلّون، شفّافون، متعدّدو اللغات.',
  'Les informations fournies ne remplacent pas un avis médical.': 'المعلومات المقدَّمة لا تُغني عن استشارة طبّية.',

  // ---- SEO ----
  'Analysez les ingrédients, comparez les produits et trouvez votre routine — un focus unique sur les marques allemandes de santé & beauté.':
    'حلّل المكوّنات، وقارن المنتجات، واعثر على روتينك — مع تركيز فريد على العلامات الألمانية للصحّة والجمال.',
}

// ---------------------------------------------------------------------------
// Libellés du back-office : ils étaient écrits en français en dur dans
// ADMIN_FIELDS. On les traduit ici sans toucher aux `path` des champs.
// ---------------------------------------------------------------------------
export const AR_ADMIN = {
  'Nom': 'الاسم',
  'Slug': '[[Slug]]',
  'Marque (nom)': 'العلامة (الاسم)',
  'Marque (slug)': 'العلامة ([[slug]])',
  'Univers (skincare/hair/wellness)': 'العالم ([[skincare/hair/wellness]])',
  'Catégorie (cleanser/serum/moisturizer/sunscreen/shampoo/conditioner/hair-treatment/scalp-serum/supplement/tea/bath-body)':
    'الفئة ([[cleanser/serum/moisturizer/sunscreen/shampoo/conditioner/hair-treatment/scalp-serum/supplement/tea/bath-body]])',
  'Prix (€)': 'السعر (€)',
  'Note (0-5)': 'التقييم (0-5)',
  'Image URL': 'رابط الصورة',
  'Lien affilié': 'رابط الإحالة',
  'Made in Germany': '[[Made in Germany]]',
  'Préoccupations (csv: acne,aging...)': 'المشكلات ([[csv]]: acne,aging...)',
  'Types de peau (csv)': 'أنواع البشرة ([[csv]])',
  'Ingrédients (slugs csv)': 'المكوّنات ([[slugs csv]])',
  'Description FR': 'الوصف [[FR]]',
  'Description EN': 'الوصف [[EN]]',
  'Description AR': 'الوصف [[AR]]',
  'Pays': 'البلد',
  'Ville': 'المدينة',
  'Année de création': 'سنة التأسيس',
  'Marque allemande': 'علامة ألمانية',
  'Site web': 'الموقع الإلكتروني',
  'Fabricant': 'الشركة المصنِّعة',
  'Certifications (csv)': 'الشهادات ([[csv]])',
  'INCI': '[[INCI]]',
  'Sécurité (green/caution)': 'السلامة ([[green/caution]])',
  'Preuves (strong/moderate/limited)': 'الأدلة ([[strong/moderate/limited]])',
  'Comédogénicité (0-5)': 'احتمالية سدّ المسام (0-5)',
  'Recommandé pour (csv)': 'موصى به لـ ([[csv]])',
  'Bénéfices FR (csv)': 'الفوائد [[FR]] ([[csv]])',
  'Bénéfices EN (csv)': 'الفوائد [[EN]] ([[csv]])',
  'Bénéfices AR (csv)': 'الفوائد [[AR]] ([[csv]])',
  'Contexte réglementaire FR': 'الإطار التنظيمي [[FR]]',
  'Contexte réglementaire EN': 'الإطار التنظيمي [[EN]]',
  'Contexte réglementaire AR': 'الإطار التنظيمي [[AR]]',
  'URL de la vidéo (YouTube Shorts / Instagram Reels / TikTok)': 'رابط الفيديو ([[YouTube Shorts / Instagram Reels / TikTok]])',
  'Durée (secondes)': 'المدّة (بالثواني)',
  'Produit lié (slug) — optionnel': 'المنتج المرتبط ([[slug]]) — اختياري',
  'Ingrédient lié (slug) — optionnel': 'المكوّن المرتبط ([[slug]]) — اختياري',
  'Statut (draft/published)': 'الحالة ([[draft/published]])',
  'Date (YYYY-MM-DD)': 'التاريخ ([[YYYY-MM-DD]])',
  'Titre FR': 'العنوان [[FR]]',
  'Titre EN': 'العنوان [[EN]]',
  'Titre AR': 'العنوان [[AR]]',
  'Légende FR': 'التعليق [[FR]]',
  'Légende EN': 'التعليق [[EN]]',
  'Légende AR': 'التعليق [[AR]]',
  'Catégorie (learn/guide/research/how-to)': 'الفئة ([[learn/guide/research/how-to]])',
  'Univers (skincare/hair/wellness) — optionnel': 'العالم ([[skincare/hair/wellness]]) — اختياري',
  'Extrait FR': 'المقتطف [[FR]]',
  'Extrait EN': 'المقتطف [[EN]]',
  'Extrait AR': 'المقتطف [[AR]]',
  'Contenu FR': 'المحتوى [[FR]]',
  'Contenu EN': 'المحتوى [[EN]]',
  'Contenu AR': 'المحتوى [[AR]]',
  'Slug (= id de préoccupation, ex: acne)': '[[Slug]] (= معرّف المشكلة، مثال: acne)',
  'Définition FR': 'التعريف [[FR]]',
  'Définition EN': 'التعريف [[EN]]',
  'Définition AR': 'التعريف [[AR]]',
  'Causes FR (csv)': 'الأسباب [[FR]] ([[csv]])',
  'Causes EN (csv)': 'الأسباب [[EN]] ([[csv]])',
  'Causes AR (csv)': 'الأسباب [[AR]] ([[csv]])',
  'Erreurs à éviter FR (csv)': 'أخطاء يجب تجنّبها [[FR]] ([[csv]])',
  'Erreurs à éviter EN (csv)': 'أخطاء يجب تجنّبها [[EN]] ([[csv]])',
  'Erreurs à éviter AR (csv)': 'أخطاء يجب تجنّبها [[AR]] ([[csv]])',
  "Guide d'achat FR (csv)": 'دليل الشراء [[FR]] ([[csv]])',
  "Guide d'achat EN (csv)": 'دليل الشراء [[EN]] ([[csv]])',
  "Guide d'achat AR (csv)": 'دليل الشراء [[AR]] ([[csv]])',
  'Actifs clés (slugs csv)': 'المواد الفعّالة الأساسية ([[slugs csv]])',
  'FAQ (JSON: [{"q":{"fr":"..","en":".."},"a":{"fr":"..","en":".."}}])':
    'الأسئلة الشائعة ([[JSON]])',
}

// ---------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------

const KW_RE = /\[\[([^\]]+)\]\]/g

// Chaîne brute dans la langue demandée (balises `[[…]]` conservées).
export const raw = (lang, fr, en) => {
  if (lang === 'ar') return AR[fr] !== undefined ? AR[fr] : (AR[en] !== undefined ? AR[en] : fr)
  if (lang === 'en') return en !== undefined ? en : fr
  return fr
}

// Version texte pur : pour les attributs DOM (placeholder, aria-label, title),
// document.title, confirm(), navigator.share()… où un nœud React serait rendu
// « [object Object] ».
export const ts = (lang, fr, en) => String(raw(lang, fr, en)).replace(KW_RE, '$1')

// Pastille « mot-clé sans équivalent » : fond plus foncé, dans le ton de la
// plateforme, et direction LTR forcée pour rester lisible au sein d'un texte
// arabe (RTL).
export const Kw = ({ children, className = '', lang, variant }) => {
  if (lang && lang !== 'ar') return children
  if (children === null || children === undefined || children === '') return null
  const cls = ['dz-kw', variant === 'title' ? 'dz-kw--title' : '', className].filter(Boolean).join(' ')
  return createElement('span', { className: cls, dir: 'ltr' }, children)
}

// Découpe une chaîne balisée et remplace chaque `[[mot-clé]]` par une pastille.
// Renvoie la chaîne telle quelle quand il n'y a aucun mot-clé, pour ne pas
// alourdir l'arbre React.
export const renderKw = (str) => {
  if (!str || !String(str).includes('[[')) return str
  const parts = String(str).split(KW_RE)
  return createElement(
    Fragment,
    null,
    ...parts.map((part, i) =>
      i % 2 === 1
        ? createElement('span', { key: `kw-${i}`, className: 'dz-kw', dir: 'ltr' }, part)
        : part
    )
  )
}

// Version JSX : identique à `ts` mais les mots-clés sortent dans une pastille.
export const t = (lang, fr, en) => renderKw(raw(lang, fr, en))

// Libellé d'un champ du back-office (source française en dur dans ADMIN_FIELDS).
export const tAdmin = (lang, frLabel) => {
  if (lang !== 'ar') return frLabel
  return renderKw(AR_ADMIN[frLabel] || frLabel)
}

// Résout un champ multilingue `{ fr, en, ar }` venant de l'API ou d'une
// constante. Repli : langue demandée → français → anglais, pour ne jamais
// afficher un trou quand le contenu éditorial n'est pas encore traduit.
// Les mots-clés balisés `[[…]]` des constantes sortent en pastille.
// Ordre de repli par langue. L'arabe retombe sur le français (langue source du
// contenu éditorial) ; le français et l'anglais ne retombent jamais sur l'arabe,
// qui serait illisible pour eux.
const FALLBACK = { ar: ['ar', 'fr', 'en'], fr: ['fr', 'en'], en: ['en', 'fr'] }

const isFilled = (v) =>
  v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)

const resolve = (obj, lang) => {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string' || Array.isArray(obj)) return obj
  for (const key of FALLBACK[lang] || FALLBACK.fr) {
    if (isFilled(obj[key])) return obj[key]
  }
  return undefined
}

export const pick = (obj, lang) => {
  const v = resolve(obj, lang)
  return typeof v === 'string' ? renderKw(v) : v
}

// Variante texte pur : attributs DOM (aria-label, title) et traitements de
// chaîne (split, longueur…), où un nœud React n'aurait pas de sens.
export const pickText = (obj, lang) => {
  const v = resolve(obj, lang)
  return typeof v === 'string' ? v.replace(KW_RE, '$1') : v
}
