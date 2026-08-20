// =============================================================================
// Données de démonstration — Avis clients, Questions/Réponses & Forum
// =============================================================================
// Contenu rédigé à la main pour donner une impression de communauté active et
// crédible : chaque avis est unique, ancré dans le produit qu'il commente
// (texture, parfum, prix, durée d'utilisation, résultat constaté) et le corpus
// contient sa part d'avis mitigés ou négatifs, comme sur un vrai site.
//
// Aucune donnée n'est ensemencée avec un _id/created_at ici : route.js assigne
// id (uuid), created_at (à partir de `days_ago`) et status='approved' à l'insert.
// Tout le corpus est en français, comme le reste du contenu de démonstration
// (les avis ne sont pas traduits par langue d'affichage).
// =============================================================================

// Catégories du forum communautaire (libellés tri-lingues).
export const FORUM_CATEGORIES = [
  { id: 'routine', icon: 'ListChecks', fr: 'Routines & conseils', en: 'Routines & tips', ar: 'روتين ونصائح' },
  { id: 'ingredients', icon: 'FlaskConical', fr: 'Ingrédients & science', en: 'Ingredients & science', ar: 'المكوّنات والعلم' },
  { id: 'hair', icon: 'Scissors', fr: 'Cheveux & cuir chevelu', en: 'Hair & scalp', ar: 'الشعر وفروة الرأس' },
  { id: 'wellness', icon: 'HeartPulse', fr: 'Bien-être & compléments', en: 'Wellness & supplements', ar: 'العافية والمكمّلات' },
  { id: 'brands', icon: 'Building2', fr: 'Marques allemandes', en: 'German brands', ar: 'العلامات الألمانية' },
]

const STAFF = 'Équipe Dermalyze'

// ---- Avis clients -------------------------------------------------------
// Chaque entrée de REVIEW_SETS cible un produit, une marque ou un ingrédient.
// Légende des champs d'un avis (format court pour garder le corpus lisible) :
//   d = jours écoulés depuis la publication   r = note de 1 à 5
//   a = nom affiché de l'auteur               v = achat vérifié
//   h = votes « utile »                       t = titre (optionnel)
//   b = corps de l'avis
// Les notes de chaque produit sont dosées pour retomber sur la note moyenne
// affichée dans la fiche produit (champ `rating` du catalogue).

const REVIEW_SETS = [
  // ===================== SKINCARE =====================
  {
    target_type: 'product', target_slug: 'weleda-skin-food', // moyenne visée 4.7
    items: [
      { d: 3, r: 5, a: 'Sophie L.', v: true, h: 21, t: "A sauvé mes joues cet hiver", b: "Entre le froid dehors et le chauffage au bureau, ma peau desquamait autour du nez et sur les pommettes. Une noisette réchauffée entre les doigts chaque soir et en trois jours tout était rentré dans l'ordre. Attention, la texture est vraiment épaisse : il faut l'émulsionner avant de l'appliquer." },
      { d: 6, r: 5, a: 'Amélie R.', v: true, h: 14, t: "Le petit tube ne me quitte plus", b: "J'en ai un dans mon sac et un grand pot sur la table de nuit. Sur les mains après une journée de lavages répétés, rien ne fait mieux, et l'odeur d'orange douce est un vrai plaisir." },
      { d: 8, r: 4, a: 'Karim B.', v: false, h: 6, b: "Très efficace sur les zones sèches, mais sur le visage entier c'est trop riche pour moi. Je m'en sers uniquement sur les joues et les coudes, et là c'est parfait." },
      { d: 11, r: 5, a: 'Nadia K.', v: true, h: 17, t: "Le seul soin que ma peau atopique supporte", b: "Après des années à tester des crèmes de pharmacie, c'est le premier produit qui n'a pas déclenché de plaques. Je l'applique sur peau encore humide après la douche, ça passe beaucoup mieux." },
      { d: 14, r: 5, a: 'Julie M.', v: true, h: 9, b: "Acheté sur les conseils de ma sœur, j'ai compris pourquoi c'est un best-seller depuis 1926. Un pot dure des mois tellement il en faut peu." },
      { d: 17, r: 4, a: 'Thomas P.', v: true, h: 5, t: "Excellent mais collant au début", b: "Les dix premières minutes après application, ça colle un peu et je ne peux pas m'habiller tout de suite. Une fois absorbé, la peau est vraiment confortable. Je l'utilise donc le soir uniquement." },
      { d: 20, r: 5, a: 'Claire D.', v: false, h: 11, b: "Je l'utilise sur mes lèvres gercées, sur les cuticules, sur les talons l'été. C'est le couteau suisse de ma trousse de toilette pour 13 euros." },
      { d: 23, r: 5, a: 'Marc V.', v: true, h: 8, t: "Indispensable pour un travail en extérieur", b: "Je travaille dehors toute la journée, mes mains étaient crevassées en janvier. Deux applications par jour pendant une semaine et la peau s'est refermée. Le tube tient bien dans la poche de veste." },
      { d: 27, r: 5, a: 'Inès F.', v: true, h: 13, b: "La texture m'a surprise au début, très dense, presque comme un baume. En fait il suffit de la faire fondre entre les paumes. Ma peau est repulpée au réveil." },
      { d: 30, r: 3, a: 'Lucas G.', v: true, h: 15, t: "Le parfum me gêne", b: "Efficacité incontestable sur la sécheresse, mais l'odeur d'huiles essentielles est trop présente pour moi le soir, je la sens encore sur l'oreiller. Dommage, sinon j'aurais mis 5 étoiles." },
      { d: 34, r: 5, a: 'Fatima Z.', v: true, h: 10, b: "Utilisé pendant ma grossesse sur le ventre et les hanches, aucune irritation et la peau restait souple. Je continue aujourd'hui sur les zones sèches." },
      { d: 38, r: 4, a: 'Camille T.', v: false, h: 4, b: "Très bon produit, mais je préfère le format tube au pot pour l'hygiène. Sinon rien à redire, la peau est nourrie pour la nuit entière." },
      { d: 42, r: 5, a: 'Antoine B.', v: true, h: 7, t: "Après-ski obligatoire", b: "Une semaine à la montagne, visage brûlé par le vent. Le soir, une couche épaisse et au matin la peau ne tirait plus du tout." },
      { d: 45, r: 5, a: 'Laura S.', v: true, h: 12, b: "Ma dermatologue me l'a conseillé pour les zones de peau très sèche après un traitement à l'isotrétinoïne. C'est ce qui m'a le plus soulagée pendant la cure." },
      { d: 49, r: 5, a: 'Yasmine H.', v: false, h: 6, b: "Composition courte et lisible, du calendula, de la camomille, pas de parfum de synthèse. Je regarde toujours l'INCI avant d'acheter et celui-là passe le test." },
      { d: 53, r: 4, a: 'Émilie C.', v: true, h: 3, b: "Parfait l'hiver, trop riche l'été. J'alterne avec une crème plus légère de mai à septembre, et je ressors le pot dès les premiers froids." },
      { d: 57, r: 5, a: 'Hugo D.', v: true, h: 5, b: "Utilisé sur un tatouage récent après la phase de cicatrisation, sur conseil du tatoueur. Les couleurs sont restées nettes et la peau n'a pas pelé." },
      { d: 61, r: 5, a: 'Sarah B.', v: true, h: 9, t: "Rapport qualité-prix imbattable", b: "Comparé aux crèmes à 40 euros que j'achetais avant, celle-ci fait mieux pour trois fois moins cher. Je ne reviendrai pas en arrière." },
      { d: 65, r: 5, a: 'Léa N.', v: false, h: 4, b: "Je l'applique en masque épais 20 minutes le dimanche soir, puis je retire l'excédent avec un mouchoir. Effet peau neuve le lundi matin." },
      { d: 70, r: 4, a: 'Mehdi A.', v: true, h: 2, b: "Efficace mais met du temps à pénétrer. Sur peau normale ça reste un peu lourd, à réserver aux peaux vraiment sèches je pense." },
      { d: 74, r: 5, a: 'Chloé P.', v: true, h: 8, b: "Trois hivers que j'en achète. La formule n'a pas changé, l'efficacité non plus, c'est suffisamment rare pour être signalé." },
      { d: 79, r: 5, a: 'Pauline R.', v: true, h: 6, b: "Sur les mains de ma mère, 78 ans, peau très fine et fragile : elle m'a redemandé un pot dès le mois suivant." },
      { d: 84, r: 5, a: 'Nicolas L.', v: false, h: 3, b: "Je m'en sers aussi comme baume à barbe improvisé quand la peau dessous démange. Ça calme immédiatement." },
      { d: 88, r: 2, a: 'Sabrina M.', v: true, h: 18, t: "Ma peau mixte n'a pas aimé", b: "Deux semaines d'utilisation sur tout le visage et j'ai eu des microkystes sur la zone T. C'est probablement ma faute, ce n'est clairement pas fait pour les peaux mixtes à grasses, mais je préviens celles qui hésitent." },
      { d: 93, r: 5, a: 'Vincent T.', v: true, h: 5, b: "Le pot de 75 ml est plus économique que le tube et je n'ai eu aucun problème de conservation au bout de six mois." },
      { d: 98, r: 5, a: 'Manon G.', v: true, h: 7, b: "Peau réactive, rougeurs faciles. Aucune réaction, au contraire ça apaise. Je l'utilise en couche fine sous ma crème solaire l'hiver." },
      { d: 104, r: 4, a: 'Rachid O.', v: false, h: 2, b: "Bon produit mais il faut aimer les textures très riches. Ce n'est pas une crème de jour classique, il faut le savoir avant d'acheter." },
      { d: 110, r: 5, a: 'Elodie V.', v: true, h: 6, b: "J'ai testé la version light aussi, mais l'originale reste plus efficace sur les zones vraiment abîmées." },
      { d: 117, r: 5, a: 'Jonas W.', v: true, h: 4, b: "Acheté en Allemagne à l'origine, je le retrouve ici au même prix. La qualité Weleda ne se dément pas." },
      { d: 123, r: 5, a: 'Amina S.', v: true, h: 9, b: "Mes enfants ont la peau sèche derrière les genoux en hiver. Un peu de Skin Food le soir et plus de grattage la nuit." },
      { d: 131, r: 5, a: 'Bastien R.', v: false, h: 3, b: "Rien à dire, c'est un classique qui mérite sa réputation. Je le rachète les yeux fermés." },
      { d: 138, r: 4, a: 'Nora T.', v: true, h: 5, b: "Très bien mais je trouve le tube difficile à vider entièrement. Je le découpe à la fin pour récupérer le reste." },
      { d: 146, r: 5, a: 'Grégoire M.', v: true, h: 4, b: "Peau sèche depuis toujours, j'ai enfin trouvé quelque chose qui tient toute la journée sans réapplication." },
      { d: 155, r: 5, a: 'Salima B.', v: true, h: 8, b: "Après chaque séance de piscine, ma peau tiraillait à cause du chlore. Ce baume règle le problème en une application." },
      { d: 163, r: 5, a: 'Théo C.', v: false, h: 2, b: "Testé après avoir vu des dermatologues le recommander sur les réseaux. Pour une fois, le produit hypé est vraiment bon." },
      { d: 172, r: 5, a: 'Delphine A.', v: true, h: 6, b: "L'odeur me rappelle les soins de ma grand-mère, c'est agréable et pas du tout chimique. Efficacité au rendez-vous sur les mains." },
      { d: 184, r: 4, a: 'Youssef E.', v: true, h: 3, b: "Un peu cher au format voyage rapporté au volume, mais pratique en avion. Le grand pot reste le meilleur achat." },
      { d: 196, r: 5, a: 'Charlotte D.', v: true, h: 5, b: "Deux ans que je l'utilise, ma peau ne desquame plus du tout l'hiver. Devenue une habitude, pas un test." },
      { d: 210, r: 5, a: 'Farid H.', v: true, h: 4, b: "Efficace sur les gerçures des mains liées au travail en cuisine, où l'on se lave les mains vingt fois par jour." },
    ],
  },
  {
    target_type: 'product', target_slug: 'eucerin-hyaluron-filler-serum', // moyenne visée 4.6
    items: [
      { d: 5, r: 5, a: 'Nadia K.', v: true, h: 16, t: "Effet repulpant réel sur les ridules", b: "Trois flacons plus tard, les petites rides sous les yeux et au coin de la bouche sont nettement moins marquées le matin. J'applique deux pressions sur peau humide, puis ma crème par-dessus, sinon ça tiraille." },
      { d: 9, r: 5, a: 'Charlotte D.', v: true, h: 11, b: "Texture très fluide qui pénètre en quelques secondes, aucun film collant. Le maquillage tient parfaitement par-dessus, ce qui n'était pas le cas avec mon sérum précédent." },
      { d: 13, r: 4, a: 'Hugo D.', v: false, h: 4, b: "Bonne hydratation, mais à 30 euros les 30 ml je m'attendais à un effet plus spectaculaire sur les rides installées. Sur les ridules de déshydratation par contre, ça fonctionne." },
      { d: 18, r: 5, a: 'Manon G.', v: true, h: 9, t: "Enfin un sérum que ma peau sensible tolère", b: "Rosacée légère, la plupart des sérums me font rougir. Celui-ci passe sans aucun picotement, y compris sur les ailes du nez." },
      { d: 24, r: 5, a: 'Youssef E.', v: true, h: 6, b: "Acheté après une comparaison des concentrations d'acide hyaluronique. Le double poids moléculaire fait la différence : hydratation en surface et confort qui dure la journée." },
      { d: 29, r: 4, a: 'Sarah B.', v: true, h: 5, b: "Très bien mais le flacon pompe distribue beaucoup de produit d'un coup, je gaspille. Sinon, aucune critique sur la formule." },
      { d: 36, r: 5, a: 'Bastien R.', v: false, h: 3, b: "Utilisé matin et soir depuis six semaines. Ma peau est visiblement plus rebondie, surtout au réveil. Je le recommande à ceux qui commencent l'anti-âge sans vouloir attaquer au rétinol." },
      { d: 44, r: 5, a: 'Delphine A.', v: true, h: 8, b: "Après 45 ans ma peau devenait terne et déshydratée. Ce sérum a réglé la déshydratation en un mois, le teint suit. Je l'associe au booster vitamine C le matin." },
      { d: 52, r: 3, a: 'Farid H.', v: true, h: 7, t: "Rien de mal, rien de fou", b: "Deux mois d'utilisation, hydratation correcte mais je ne vois pas de différence sur les rides. Pour ce prix j'espérais mieux, je vais tester autre chose." },
      { d: 63, r: 5, a: 'Amina S.', v: true, h: 4, b: "Sous le climat sec de l'été, c'est le seul sérum qui me tient jusqu'au soir sans sensation de tiraillement." },
      { d: 78, r: 5, a: 'Grégoire M.', v: true, h: 3, b: "Peu de parfum, pas d'alcool en tête de liste, formule sérieuse. On sent la marque dermatologique plutôt que le marketing." },
      { d: 95, r: 4, a: 'Nora T.', v: false, h: 2, b: "Bon sérum, mais il faut impérativement une crème par-dessus, seul il ne suffit pas en hiver." },
      { d: 128, r: 5, a: 'Salima B.', v: true, h: 5, b: "Troisième rachat. Ma peau supporte mal le changement, alors quand quelque chose marche je ne bouge plus." },
    ],
  },
  {
    target_type: 'product', target_slug: 'nivea-luminous630-serum', // moyenne visée 4.4
    items: [
      { d: 7, r: 5, a: 'Fatima Z.', v: true, h: 19, t: "Mon masque de grossesse s'est estompé", b: "Le mélasma sur les pommettes me complexait depuis deux ans. Après dix semaines d'application matin et soir, avec un SPF 50 systématique, les taches sont clairement plus pâles. Ce n'est pas magique, il faut être régulière." },
      { d: 12, r: 4, a: 'Léa N.', v: true, h: 8, b: "Résultat visible sur les marques post-acné au bout d'un mois. Sur les taches de soleil plus anciennes, c'est plus lent. Texture agréable, pénètre vite." },
      { d: 19, r: 5, a: 'Amina S.', v: true, h: 12, b: "J'ai commencé en septembre pour éviter le soleil fort, comme conseillé sur la fiche. Trois mois après, le teint est beaucoup plus uniforme. Le flacon dure environ deux mois." },
      { d: 26, r: 4, a: 'Nicolas L.', v: false, h: 4, b: "Efficace mais il faut absolument y associer une protection solaire, sinon on annule tout. Ce n'est pas indiqué assez clairement sur l'emballage." },
      { d: 33, r: 3, a: 'Elodie V.', v: true, h: 11, t: "Trop lent pour moi", b: "Six semaines et je ne vois presque rien sur mes taches. Peut-être qu'il faut plus de temps, mais à 25 euros le flacon je trouve l'attente longue." },
      { d: 41, r: 5, a: 'Théo C.', v: true, h: 6, b: "Utilisé sur des cicatrices d'acné pigmentées sur les joues. Nette amélioration en deux mois, ma copine a remarqué avant moi." },
      { d: 55, r: 4, a: 'Chloé P.', v: true, h: 3, b: "Bon produit, absorption rapide, pas de boutons. Je retire une étoile pour le parfum, léger mais présent, alors que les peaux à taches sont souvent réactives." },
      { d: 68, r: 5, a: 'Rachid O.', v: true, h: 5, b: "Le brevet Luminous630 a l'air sérieux, avec de vraies études derrière. Résultat conforme à la promesse : moins de taches, teint plus lumineux." },
      { d: 86, r: 4, a: 'Julie M.', v: false, h: 2, b: "Je l'ai adopté après avoir arrêté l'hydroquinone prescrite par la dermatologue. Moins puissant mais bien mieux toléré sur la durée." },
      { d: 112, r: 5, a: 'Vincent T.', v: true, h: 4, b: "Un an d'utilisation en entretien après une cure plus intensive. Aucune tache n'est revenue, c'est ce que je lui demande." },
    ],
  },
  {
    target_type: 'product', target_slug: 'sebamed-clear-face-gel', // moyenne visée 4.4
    items: [
      { d: 4, r: 5, a: 'Mehdi A.', v: true, h: 13, t: "Nettoie sans décaper", b: "Peau grasse depuis l'adolescence, j'utilisais des gels très agressifs qui faisaient briller encore plus deux heures après. Celui-ci nettoie bien et la peau ne tiraille pas du tout. Moins de boutons en trois semaines." },
      { d: 10, r: 5, a: 'Léa N.', v: true, h: 9, b: "Le pH 5.5 change vraiment quelque chose : plus aucune sensation de peau qui gratte après le lavage. Le flacon pompe est pratique sous la douche." },
      { d: 16, r: 4, a: 'Antoine B.', v: false, h: 5, b: "Efficace sur les points noirs du nez au bout d'un mois. Ça mousse peu, ce qui déroute au début, mais c'est normal pour un nettoyant sans savon." },
      { d: 22, r: 5, a: 'Sabrina M.', v: true, h: 7, b: "Utilisé matin et soir par mon fils de 16 ans, sur conseil du dermatologue. Sa peau s'est calmée sans dessèchement, et à 8,50 euros je peux racheter sans compter." },
      { d: 31, r: 4, a: 'Chloé P.', v: true, h: 4, b: "Bon nettoyant au quotidien, mais insuffisant pour retirer un maquillage tenace. Je démaquille avant, sinon il reste des résidus." },
      { d: 40, r: 3, a: 'Hugo D.', v: true, h: 6, t: "Correct mais sans effet sur mon acné", b: "Bien toléré, ne dessèche pas, mais l'acide salicylique est trop peu concentré pour agir vraiment sur mes boutons. À voir comme un nettoyant doux, pas comme un traitement." },
      { d: 57, r: 5, a: 'Karim B.', v: true, h: 5, b: "Trois flacons de suite. Il a remplacé mon gel de pharmacie deux fois plus cher, avec un résultat identique voire meilleur sur les rougeurs." },
      { d: 74, r: 4, a: 'Manon G.', v: false, h: 2, b: "Agréable, texture fluide, se rince facilement. Le parfum est discret. Je l'utilise le matin uniquement car le soir je préfère une huile démaquillante." },
      { d: 101, r: 5, a: 'Nora T.', v: true, h: 3, b: "Ma peau mixte a arrêté de briller à midi depuis que j'ai changé de nettoyant. Le seul changement dans ma routine, donc c'est bien lui." },
    ],
  },
  {
    target_type: 'product', target_slug: 'eucerin-dermopure-serum', // moyenne visée 4.5
    items: [
      { d: 6, r: 5, a: 'Yasmine H.', v: true, h: 17, t: "Les marques post-acné enfin en recul", b: "Ce sont les taches brunes laissées par les boutons qui me gênaient le plus, plus que l'acné elle-même. Deux mois avec ce sérum le soir et elles sont bien plus claires. Le Thiamidol fait le travail." },
      { d: 11, r: 5, a: 'Lucas G.', v: true, h: 10, b: "Moins de boutons dès la troisième semaine, et surtout ils partent plus vite quand ils sortent. Texture fluide, aucune sensation grasse." },
      { d: 17, r: 4, a: 'Camille T.', v: true, h: 6, b: "Bien mais période de purge de dix jours au début, avec plus de boutons que d'habitude. Il faut tenir bon, après ça se calme vraiment." },
      { d: 25, r: 5, a: 'Sarah B.', v: false, h: 5, b: "Utilisé en alternance avec un rétinol, un soir sur deux. Ma peau tolère très bien et les résultats se cumulent." },
      { d: 34, r: 5, a: 'Farid H.', v: true, h: 4, b: "Peau grasse à imperfections depuis toujours, c'est le premier sérum qui ne me fait pas briller. Je mets une crème légère par-dessus et ça tient la journée." },
      { d: 47, r: 3, a: 'Delphine A.', v: true, h: 8, t: "Trop asséchant pour moi", b: "Efficace sur les boutons mais ma peau a pelé autour du menton dès la deuxième semaine. J'espace à trois fois par semaine, c'est plus supportable." },
      { d: 59, r: 4, a: 'Bastien R.', v: true, h: 3, b: "Acheté après avoir comparé les compositions ici. Salicylique plus Thiamidol dans le même flacon, ça évite d'empiler deux produits." },
      { d: 72, r: 4, a: 'Amélie R.', v: false, h: 2, b: "Bon produit, mais le flacon est petit pour le prix. Deux pressions matin et soir, il tient six semaines." },
      { d: 96, r: 5, a: 'Théo C.', v: true, h: 4, b: "Acné du dos aussi traitée avec, sur les zones accessibles. Ça marche également là-bas, je ne m'y attendais pas." },
      { d: 133, r: 5, a: 'Salima B.', v: true, h: 5, b: "Six mois d'utilisation, peau stabilisée. Je suis passée à une application un soir sur deux en entretien et ça tient." },
    ],
  },
  {
    target_type: 'product', target_slug: 'eucerin-sun-oil-control-spf50', // moyenne visée 4.6
    items: [
      { d: 8, r: 5, a: 'Rachid O.', v: true, h: 14, t: "Le premier SPF que ma peau grasse supporte", b: "Fini le film brillant et les boutons du lendemain. Le toucher sec est réel, la peau reste mate quatre à cinq heures avant que je doive tamponner. Je le mets tous les matins, même au bureau." },
      { d: 15, r: 5, a: 'Émilie C.', v: true, h: 9, b: "Aucun fini blanc, ce qui est rare en SPF 50+. Se porte très bien sous le maquillage, sans faire de pâtés." },
      { d: 23, r: 5, a: 'Mehdi A.', v: false, h: 6, b: "Testé une journée entière en extérieur en juillet, aucun coup de soleil et pas de sensation de gras malgré la transpiration." },
      { d: 38, r: 4, a: 'Inès F.', v: true, h: 4, b: "Très bonne protection et effet matifiant efficace, mais le tube de 50 ml part vite si on applique la bonne dose sur le visage et le cou." },
      { d: 51, r: 5, a: 'Julie M.', v: true, h: 7, b: "Peau à imperfections, j'avais renoncé au solaire quotidien à cause des boutons. Deux étés avec celui-ci, zéro comédon." },
      { d: 66, r: 3, a: 'Nicolas L.', v: true, h: 5, t: "Efficace mais odeur chimique", b: "Protection irréprochable et fini mat, mais l'odeur des filtres est marquée sur le visage pendant la première demi-heure. Ça finit par passer." },
      { d: 89, r: 5, a: 'Charlotte D.', v: true, h: 3, b: "Utilisé aussi pendant une cure de rétinol, la peau était plus sensible et il n'a rien irrité." },
      { d: 119, r: 5, a: 'Youssef E.', v: false, h: 2, b: "Bon compromis entre protection élevée et texture légère. Je l'emmène partout depuis un an." },
    ],
  },
  {
    target_type: 'product', target_slug: 'dr-hauschka-creme-jour-rose', // moyenne visée 4.5
    items: [
      { d: 9, r: 5, a: 'Claire D.', v: true, h: 12, t: "Mes rougeurs se sont apaisées", b: "Peau réactive qui rougit au moindre écart de température. En un mois, les plaques sur les joues sont beaucoup moins visibles. Le parfum de rose est naturel, pas du tout écœurant." },
      { d: 16, r: 5, a: 'Pauline R.', v: true, h: 8, b: "Certifiée NATRUE, composition irréprochable, et surtout elle nourrit sans étouffer la peau. Une petite noisette suffit pour tout le visage." },
      { d: 27, r: 4, a: 'Léa N.', v: false, h: 5, b: "Très agréable mais un peu riche pour l'été. Je la garde pour la saison froide et je passe à une texture plus fluide en juin." },
      { d: 35, r: 5, a: 'Elodie V.', v: true, h: 6, b: "Ma peau supporte mal les crèmes conventionnelles. Avec celle-ci, plus de démangeaisons et le teint est plus régulier." },
      { d: 48, r: 3, a: 'Antoine B.', v: true, h: 7, t: "Le parfum floral n'est pas pour moi", b: "La crème est efficace et la peau est confortable, mais l'odeur de rose est trop présente à mon goût. Question de préférence personnelle plus que de qualité." },
      { d: 62, r: 5, a: 'Nora T.', v: true, h: 4, b: "Utilisée sous le maquillage sans aucun problème de tenue. Elle laisse un fini satiné plutôt agréable en photo." },
      { d: 91, r: 5, a: 'Grégoire M.', v: false, h: 2, b: "Achetée pour ma femme, elle en est à son troisième pot. La peau du contour du nez ne pèle plus l'hiver." },
      { d: 140, r: 4, a: 'Amélie R.', v: true, h: 3, b: "Bonne crème bio, mais le pot est petit pour 21 euros. L'efficacité compense, je rachète quand même." },
    ],
  },
  {
    target_type: 'product', target_slug: 'borlind-ll-regeneration-creme', // moyenne visée 4.3
    items: [
      { d: 13, r: 5, a: 'Delphine A.', v: true, h: 10, t: "Un anti-âge naturel qui tient ses promesses", b: "Deux mois d'utilisation, la peau est plus ferme au niveau de l'ovale du visage et les ridules du front sont adoucies. Formule végane, fabriquée en Forêt-Noire, ça change des grandes marques." },
      { d: 29, r: 4, a: 'Sabrina M.', v: true, h: 6, b: "Texture riche mais qui pénètre bien. J'aurais aimé un flacon pompe plutôt qu'un pot pour l'hygiène au quotidien." },
      { d: 44, r: 4, a: 'Charlotte D.', v: false, h: 3, b: "Bonne crème, hydratation solide toute la journée. Sur les rides marquées l'effet reste modeste, il ne faut pas attendre un lifting." },
      { d: 71, r: 5, a: 'Pauline R.', v: true, h: 5, b: "Peau sèche et sensible après 50 ans, c'est la première crème anti-âge qui ne me pique pas au contour des yeux." },
      { d: 108, r: 3, a: 'Vincent T.', v: true, h: 8, t: "Chère pour ce que c'est", b: "35 euros le pot, et je ne vois pas ce qu'elle fait de plus que ma crème habituelle à 15 euros. La composition est belle, l'effet visible non." },
      { d: 152, r: 5, a: 'Amina S.', v: true, h: 4, b: "Utilisée matin et soir tout un hiver, aucune plaque de sécheresse malgré le chauffage. Je repars pour un pot." },
    ],
  },
  {
    target_type: 'product', target_slug: 'sebamed-anti-age-q10', // moyenne visée 4.2
    items: [
      { d: 11, r: 5, a: 'Émilie C.', v: true, h: 11, t: "Excellent rapport qualité-prix", b: "15 euros pour une crème anti-âge qui hydrate correctement et n'irrite pas ma peau sensible, je ne cherche pas plus loin. Les ridules de déshydratation ont disparu en trois semaines." },
      { d: 21, r: 4, a: 'Manon G.', v: true, h: 6, b: "Bonne crème de jour, pénètre vite, pas de film gras. Sur les rides je reste prudente : c'est du confort avant tout." },
      { d: 37, r: 3, a: 'Nicolas L.', v: true, h: 7, t: "Hydratant correct, anti-âge discutable", b: "Utilisée deux mois matin et soir, aucune différence visible sur les rides du contour des yeux. Comme hydratant pH 5.5 c'est très bien, comme anti-âge j'ai des doutes." },
      { d: 58, r: 5, a: 'Salima B.', v: false, h: 4, b: "Ma peau réagit à presque tout, celle-ci passe sans rougeur. Le pH 5.5 de Sebamed n'est pas qu'un argument marketing pour moi." },
      { d: 87, r: 3, a: 'Farid H.', v: true, h: 3, b: "Texture agréable mais parfum trop marqué pour une gamme censée viser les peaux sensibles." },
      { d: 126, r: 5, a: 'Nora T.', v: true, h: 2, b: "Quatrième pot. Rien d'extraordinaire, mais fiable, jamais de mauvaise surprise et le prix reste raisonnable." },
    ],
  },
  {
    target_type: 'product', target_slug: 'weleda-lotion-nettoyante-douce', // moyenne visée 4.3
    items: [
      { d: 14, r: 5, a: 'Sophie L.', v: true, h: 9, t: "Un démaquillant qui respecte la peau", b: "Le lait retire le maquillage léger sans frotter et la peau n'est jamais tiraillée après. L'odeur d'hamamélis et de pivoine est douce, très naturelle." },
      { d: 26, r: 4, a: 'Fatima Z.', v: true, h: 5, b: "Doux et efficace au quotidien, mais il faut deux passages pour un maquillage de soirée. Je garde une huile pour ces jours-là." },
      { d: 43, r: 4, a: 'Chloé P.', v: false, h: 3, b: "Bien pour les peaux sèches, moins convaincant si vous avez la peau grasse : ça laisse un léger film." },
      { d: 64, r: 5, a: 'Claire D.', v: true, h: 6, b: "Certifié NATRUE, sans alcool, et ma peau réactive ne rougit plus après le démaquillage. Je ne changerai pas." },
      { d: 99, r: 3, a: 'Léa N.', v: true, h: 4, t: "Le flacon coule", b: "Le produit est bon mais le bouchon laisse échapper du lait quand on voyage. J'ai transvasé dans un flacon pompe." },
      { d: 158, r: 5, a: 'Amina S.', v: true, h: 2, b: "Utilisé aussi comme nettoyant du matin, très bien pour une peau qui n'aime pas les gels moussants." },
    ],
  },
  {
    target_type: 'product', target_slug: 'dr-hauschka-serum-nuit', // moyenne visée 4.1
    items: [
      { d: 18, r: 5, a: 'Pauline R.', v: true, h: 8, t: "La peau se répare vraiment la nuit", b: "Sans huile, il laisse la peau respirer et le matin le teint est frais, pas gonflé. Une pipette suffit pour deux applications." },
      { d: 32, r: 4, a: 'Yasmine H.', v: true, h: 5, b: "Agréable et bien toléré, mais l'effet reste subtil. C'est un soin de confort plus qu'un actif ciblé." },
      { d: 46, r: 4, a: 'Delphine A.', v: false, h: 3, b: "Bonne composition bio et texture légère qui ne graisse pas l'oreiller. Je le trouve juste cher pour 30 ml." },
      { d: 69, r: 5, a: 'Sophie L.', v: true, h: 4, b: "Ma peau était très déshydratée après un traitement médical, ce sérum l'a nettement apaisée en trois semaines." },
      { d: 105, r: 2, a: 'Hugo D.', v: true, h: 9, t: "Aucun effet visible", b: "Un flacon entier utilisé sérieusement chaque soir, et honnêtement je ne vois strictement rien. Ni en mieux ni en moins bien. À 32 euros, je ne rachèterai pas." },
      { d: 147, r: 4, a: 'Manon G.', v: true, h: 2, b: "Bien pour les peaux sensibles qui ne supportent pas les huiles. L'odeur d'argousier est particulière mais discrète." },
      { d: 189, r: 5, a: 'Elodie V.', v: true, h: 3, b: "Associé à la crème de jour à la rose, ma peau est stable depuis un an, sans poussée de rougeurs." },
    ],
  },
  {
    target_type: 'product', target_slug: 'nivea-sun-uv-face-spf50', // moyenne visée 4.2
    items: [
      { d: 12, r: 5, a: 'Camille T.', v: true, h: 10, t: "Zéro parfum, zéro alcool, parfait pour moi", b: "Après un peeling, ma dermatologue m'a demandé un SPF 50 sans parfum. Celui-ci ne pique pas du tout et se pose facilement, même sur peau abîmée." },
      { d: 24, r: 4, a: 'Théo C.', v: true, h: 5, b: "Texture légère et prix contenu, difficile à battre à 12 euros. Léger fini blanc les deux premières minutes, puis ça disparaît." },
      { d: 39, r: 3, a: 'Sarah B.', v: true, h: 6, t: "Brille un peu sur peau mixte", b: "Protection efficace mais je dois matifier à midi. Sur peau sèche ou sensible ce doit être idéal, sur la mienne un peu moins." },
      { d: 61, r: 5, a: 'Inès F.', v: false, h: 4, b: "Emmené en vacances au bord de la mer, résistant à l'eau comme annoncé, aucun coup de soleil sur le visage en dix jours." },
      { d: 94, r: 3, a: 'Bastien R.', v: true, h: 3, b: "Correct, sans plus. Le tube est peu pratique pour doser et j'ai tendance à en mettre trop." },
      { d: 137, r: 5, a: 'Nora T.', v: true, h: 2, b: "Utilisé quotidiennement par toute la famille, y compris sur les enfants au-dessus de trois ans. Aucune réaction, aucun problème." },
    ],
  },
  {
    target_type: 'product', target_slug: 'eucerin-vitamin-c-booster', // moyenne visée 4.5
    items: [
      { d: 7, r: 5, a: 'Amélie R.', v: true, h: 15, t: "Coup d'éclat immédiat", b: "Le système à activer soi-même garantit une vitamine C fraîche, et ça se voit : dès la première semaine le teint est plus lumineux, moins gris au réveil. Je l'utilise le matin sous mon SPF." },
      { d: 15, r: 5, a: 'Vincent T.', v: true, h: 8, b: "10% de vitamine C pure, c'est assez pour agir sans irriter. Aucun picotement, contrairement à d'autres sérums plus concentrés que j'ai essayés." },
      { d: 28, r: 4, a: 'Salima B.', v: true, h: 6, b: "Résultat très correct sur l'éclat, moins sur les taches. Le flacon dure quatre semaines une fois activé, ça oblige à consommer vite." },
      { d: 42, r: 5, a: 'Farid H.', v: false, h: 4, b: "Bonne stabilité, pas de virage orangé au bout de trois semaines comme avec d'autres sérums à la vitamine C." },
      { d: 56, r: 3, a: 'Chloé P.', v: true, h: 9, t: "Format contraignant", b: "Sérum efficace mais il faut le finir rapidement après activation, et à 23 euros les 8 ml ça revient cher au mois. La formule mérite mieux comme conditionnement." },
      { d: 82, r: 5, a: 'Julie M.', v: true, h: 5, b: "Associé au Hyaluron-Filler, ma peau a rarement été aussi lumineuse. Le duo fonctionne très bien le matin." },
      { d: 115, r: 4, a: 'Rachid O.', v: true, h: 3, b: "Bon produit, texture fluide et non collante. Je note simplement qu'il faut vraiment mettre un SPF derrière." },
      { d: 168, r: 5, a: 'Manon G.', v: true, h: 2, b: "Cure de six semaines deux fois par an, en sortie d'hiver et à l'automne. C'est comme ça que je l'utilise le plus efficacement." },
    ],
  },
  {
    target_type: 'product', target_slug: 'borlind-retinol-nature-serum', // moyenne visée 4.2
    items: [
      { d: 10, r: 5, a: 'Elodie V.', v: true, h: 13, t: "Introduction progressive et zéro irritation", b: "J'ai commencé deux soirs par semaine pendant un mois, puis un soir sur deux. Le grain de peau est nettement affiné, les pores du nez moins visibles. Le squalane compense bien l'effet asséchant du rétinol." },
      { d: 22, r: 4, a: 'Grégoire M.', v: true, h: 7, b: "Bon rétinol végétal, mieux toléré qu'un rétinal classique. Efficacité un peu plus lente en contrepartie, il faut être patient." },
      { d: 38, r: 3, a: 'Sabrina M.', v: true, h: 10, t: "Ma peau a pelé malgré tout", b: "Même en y allant doucement, j'ai eu des desquamations autour du nez pendant deux semaines. Ça s'est calmé ensuite, mais l'adaptation a été rude." },
      { d: 60, r: 5, a: 'Delphine A.', v: false, h: 5, b: "40 euros mais le flacon dure quatre mois avec deux applications par semaine. Le calcul reste raisonnable pour un rétinol de cette qualité." },
      { d: 103, r: 3, a: 'Youssef E.', v: true, h: 4, b: "Effet réel mais modeste après trois mois. Je m'attendais à plus sur les rides du front, c'est surtout la texture de peau qui s'est améliorée." },
      { d: 176, r: 5, a: 'Charlotte D.', v: true, h: 3, b: "Un an d'utilisation en alternance avec un acide. Les ridules du contour des lèvres se sont estompées, je continue." },
    ],
  },
  // ===================== CHEVEUX =====================
  {
    target_type: 'product', target_slug: 'alpecin-caffeine-shampoo-c1', // moyenne visée 4.3
    items: [
      { d: 5, r: 5, a: 'Thomas P.', v: true, h: 22, t: "Quatre mois, la chute a nettement ralenti", b: "Je perdais énormément de cheveux au lavage, le fond de douche était impressionnant. Depuis quatre mois, avec deux minutes de pose à chaque shampoing, la quantité a visiblement diminué. Ce n'est pas une repousse miracle, mais la chute s'est calmée." },
      { d: 9, r: 5, a: 'Mehdi A.', v: true, h: 14, b: "Le picotement de la caféine sur le cuir chevelu est agréable et on sait que le produit travaille. Cheveux propres, pas alourdis, usage quotidien sans problème." },
      { d: 16, r: 4, a: 'Nicolas L.', v: true, h: 8, b: "Bon shampoing, mais il assèche un peu les longueurs. J'utilise un après-shampoing sur les pointes uniquement, et ça règle le souci." },
      { d: 21, r: 3, a: 'Vincent T.', v: true, h: 17, t: "Trois mois sans résultat pour moi", b: "Calvitie déjà bien avancée sur le sommet du crâne. Je ne constate aucune différence après trois mois. J'ai l'impression que ça agit surtout en prévention, quand la chute commence, pas quand elle est installée." },
      { d: 28, r: 5, a: 'Antoine B.', v: false, h: 9, b: "9 euros le flacon en usage quotidien, c'est l'un des rares produits anti-chute abordables. Je le combine avec le tonique sans rinçage." },
      { d: 35, r: 5, a: 'Farid H.', v: true, h: 7, b: "Mon coiffeur a remarqué que les cheveux de la tempe droite étaient plus denses au bout de cinq mois. Je n'y croyais pas au départ." },
      { d: 47, r: 3, a: 'Grégoire M.', v: true, h: 6, t: "L'odeur ne fait pas l'unanimité", b: "Efficacité correcte, mais l'odeur médicinale reste dans les cheveux quelques heures. Ma femme n'aime pas du tout." },
      { d: 58, r: 5, a: 'Bastien R.', v: true, h: 5, b: "Utilisé depuis un an sans interruption. Rien de spectaculaire, mais la densité est stable alors qu'elle reculait avant. Pour moi, c'est déjà un résultat." },
      { d: 76, r: 4, a: 'Youssef E.', v: true, h: 4, b: "Bien pour le cuir chevelu gras, il nettoie sans agresser. Sur la chute, l'effet est difficile à mesurer honnêtement." },
      { d: 91, r: 5, a: 'Théo C.', v: false, h: 3, b: "Le best-seller allemand mérite sa réputation. J'ai commencé à 27 ans en prévention, cinq mois plus tard je n'ai plus de cheveux sur l'oreiller." },
      { d: 124, r: 5, a: 'Rachid O.', v: true, h: 6, b: "La règle des deux minutes de pose est la clé : quand je suis pressé et que je rince tout de suite, je vois la différence sur le mois." },
      { d: 165, r: 3, a: 'Marc V.', v: true, h: 4, b: "Correct mais je trouve le flacon peu pratique, le bouchon se bloque avec le calcaire. Le produit en lui-même ne m'a pas déçu." },
    ],
  },
  {
    target_type: 'product', target_slug: 'alpecin-liquid-hair-energizer', // moyenne visée 4.2
    items: [
      { d: 13, r: 5, a: 'Marc V.', v: true, h: 11, t: "Le complément logique du shampoing C1", b: "Deux pressions sur le cuir chevelu après la douche, on masse, on ne rince pas. La caféine reste au contact toute la journée et le cuir chevelu gratte beaucoup moins qu'avant." },
      { d: 27, r: 4, a: 'Thomas P.', v: true, h: 6, b: "Bien mais le produit laisse un léger film les premières heures. Sur cheveux courts ça ne se voit pas, sur cheveux longs c'est plus discutable." },
      { d: 41, r: 3, a: 'Hugo D.', v: true, h: 7, t: "Trop d'alcool à mon goût", b: "L'odeur d'alcool est forte à l'application et mon cuir chevelu, déjà sec, l'a mal supporté. J'ai arrêté au bout de trois semaines." },
      { d: 66, r: 5, a: 'Bastien R.', v: false, h: 4, b: "Utilisé le matin après la douche, ça réveille aussi le cuir chevelu qui gratte. Effet fraîcheur agréable en été." },
      { d: 97, r: 3, a: 'Nicolas L.', v: true, h: 3, b: "Difficile de dire ce qui vient du shampoing et ce qui vient du tonique, je les utilise ensemble. Correct, sans certitude sur son apport propre." },
      { d: 143, r: 5, a: 'Farid H.', v: true, h: 5, b: "Six mois avec le duo, densité stabilisée. Le flacon dure environ deux mois à raison d'une application par jour." },
    ],
  },
  {
    target_type: 'product', target_slug: 'schwarzkopf-gliss-total-repair-shampoo', // moyenne visée 4.1
    items: [
      { d: 11, r: 5, a: 'Sarah B.', v: true, h: 9, t: "Cheveux décolorés sauvés", b: "Après une décoloration ratée, mes longueurs cassaient au brossage. Trois lavages avec ce shampoing et la fibre a retrouvé de la souplesse. Le prix est dérisoire pour le résultat." },
      { d: 23, r: 4, a: 'Léa N.', v: true, h: 5, b: "Bon shampoing réparateur au quotidien, mousse bien et démêle. Le parfum est très présent, un peu sucré, à voir selon les goûts." },
      { d: 34, r: 4, a: 'Chloé P.', v: false, h: 3, b: "Efficace sur les cheveux secs, mais il alourdit un peu les racines si on l'utilise tous les jours. Deux fois par semaine c'est parfait." },
      { d: 52, r: 5, a: 'Manon G.', v: true, h: 4, b: "5,50 euros et il fait le travail d'un soin de salon à 20 euros. Je l'associe au masque de la même gamme." },
      { d: 79, r: 4, a: 'Amina S.', v: true, h: 2, b: "Bien mais les silicones donnent un effet lisse un peu artificiel à mon goût. Le résultat visuel est indéniable cependant." },
      { d: 118, r: 2, a: 'Elodie V.', v: true, h: 8, t: "Trop de silicones pour mes cheveux fins", b: "Au bout de deux semaines, mes cheveux fins étaient plats et gras à la racine dès le lendemain du lavage. Bon pour les cheveux épais et abîmés, à éviter si vous avez les cheveux fins." },
      { d: 171, r: 5, a: 'Nora T.', v: true, h: 3, b: "Cheveux longs et secs par les pointes, plus de nœuds au démêlage depuis que je l'utilise." },
    ],
  },
  {
    target_type: 'product', target_slug: 'schwarzkopf-gliss-ultimate-repair-masque', // moyenne visée 4.4
    items: [
      { d: 8, r: 5, a: 'Chloé P.', v: true, h: 13, t: "Quatre minutes qui changent tout", b: "Cheveux bouclés très secs après l'été. Une pose de quatre minutes sous une serviette chaude et les boucles se redessinent, brillantes, sans effet paille. Je fais ça une fois par semaine." },
      { d: 19, r: 5, a: 'Yasmine H.', v: true, h: 8, b: "Le meilleur masque de supermarché que j'ai testé. Il faut bien insister sur les longueurs et éviter les racines." },
      { d: 30, r: 4, a: 'Camille T.', v: true, h: 5, b: "Très bon rapport qualité-prix, mais le pot part vite avec des cheveux longs. Je le rachète quand même chaque mois." },
      { d: 49, r: 5, a: 'Léa N.', v: false, h: 4, b: "Utilisé avant une coloration pour préparer la fibre, ma coiffeuse a trouvé les cheveux en bien meilleur état qu'avant." },
      { d: 73, r: 4, a: 'Salima B.', v: true, h: 3, b: "Résultat brillant immédiat, mais l'effet s'estompe au bout de deux ou trois lavages. C'est un soin d'entretien, pas une reconstruction durable." },
      { d: 109, r: 3, a: 'Pauline R.', v: true, h: 6, t: "Parfum entêtant", b: "Le soin fonctionne mais le parfum reste dans les cheveux deux jours. J'aimerais une version sans parfum." },
      { d: 154, r: 5, a: 'Amélie R.', v: true, h: 2, b: "Après une saison de piscine, il a rattrapé des longueurs devenues rêches. Efficace dès la première application." },
    ],
  },
  {
    target_type: 'product', target_slug: 'sebamed-anti-dandruff-shampoo', // moyenne visée 4.3
    items: [
      { d: 6, r: 5, a: 'Karim B.', v: true, h: 16, t: "Plus une pellicule en deux semaines", b: "J'avais essayé plusieurs antipelliculaires qui décapaient le cuir chevelu et le faisaient gratter encore plus. Celui-ci est doux, pH 5.5, et les pellicules ont disparu en deux semaines. Je suis passé à deux lavages par semaine en entretien." },
      { d: 17, r: 5, a: 'Émilie C.', v: true, h: 9, b: "Cuir chevelu sensible et pellicules grasses, ce shampoing gère les deux. La piroctone olamine est bien mieux tolérée que les anciens produits au zinc." },
      { d: 29, r: 4, a: 'Lucas G.', v: true, h: 5, b: "Efficace mais il faut le laisser poser quelques minutes, sinon le résultat est moyen. Ce n'est pas indiqué très clairement sur le flacon." },
      { d: 45, r: 5, a: 'Antoine B.', v: false, h: 4, b: "Les démangeaisons ont cessé dès le deuxième lavage. Pour moi c'était le plus urgent, les pellicules ont suivi." },
      { d: 68, r: 4, a: 'Théo C.', v: true, h: 3, b: "Bon produit, mais il ne mousse pas beaucoup et j'ai tendance à en utiliser trop du coup." },
      { d: 102, r: 2, a: 'Rachid O.', v: true, h: 7, t: "Pas suffisant pour une dermite séborrhéique", b: "Sur des pellicules simples ça doit très bien marcher, mais sur ma dermite le résultat est insuffisant. Le dermatologue m'a finalement prescrit un traitement au kétoconazole." },
      { d: 149, r: 5, a: 'Nora T.', v: true, h: 2, b: "Utilisé en alternance avec un shampoing doux, cuir chevelu stable depuis huit mois." },
    ],
  },
  {
    target_type: 'product', target_slug: 'eucerin-dermocapillaire-uree', // moyenne visée 4.5
    items: [
      { d: 10, r: 5, a: 'Sabrina M.', v: true, h: 12, t: "Le seul qui calme mon cuir chevelu qui gratte", b: "Cuir chevelu sec et irrité, des démangeaisons permanentes qui me réveillaient la nuit. Dès la première utilisation le soulagement est net, et au bout d'une semaine plus de grattage du tout. Sans parfum, c'est appréciable." },
      { d: 24, r: 5, a: 'Claire D.', v: true, h: 8, b: "L'urée à 5% fait vraiment la différence sur un cuir chevelu qui desquame. Il ne mousse pas beaucoup mais nettoie très bien." },
      { d: 39, r: 4, a: 'Grégoire M.', v: true, h: 5, b: "Efficace mais cher pour un shampoing, 13,50 euros. Je l'utilise deux fois par semaine et un shampoing doux le reste du temps pour l'économiser." },
      { d: 57, r: 5, a: 'Amina S.', v: false, h: 4, b: "Recommandé par ma dermatologue pour un psoriasis léger du cuir chevelu. En complément du traitement, il apaise beaucoup." },
      { d: 88, r: 3, a: 'Vincent T.', v: true, h: 6, t: "Peu agréable à utiliser", b: "L'efficacité est là, mais la texture est étrange et l'absence de parfum donne une odeur un peu médicinale. On l'utilise par nécessité, pas par plaisir." },
      { d: 132, r: 5, a: 'Delphine A.', v: true, h: 3, b: "Après six mois, plus aucune plaque sèche derrière les oreilles. Je continue en entretien une fois par semaine." },
    ],
  },
  {
    target_type: 'product', target_slug: 'weleda-huile-cheveux-romarin', // moyenne visée 4.4
    items: [
      { d: 15, r: 5, a: 'Fatima Z.', v: true, h: 10, t: "Bain d'huile du dimanche", b: "Je l'applique sur les longueurs et le cuir chevelu une heure avant le shampoing, cheveux enroulés dans une serviette. Les longueurs sont nourries sans être grasses après le lavage, et l'odeur de romarin est très agréable." },
      { d: 33, r: 5, a: 'Yasmine H.', v: true, h: 7, b: "Utilisée en massage du cuir chevelu deux fois par semaine. Je ne peux pas jurer d'une repousse, mais les cheveux tombent moins au brossage." },
      { d: 54, r: 4, a: 'Salima B.', v: false, h: 4, b: "Bonne huile bio, mais il en faut peu sinon deux shampoings sont nécessaires pour tout retirer." },
      { d: 83, r: 3, a: 'Mehdi A.', v: true, h: 5, t: "Odeur trop forte pour moi", b: "Le romarin est vraiment marqué et l'odeur tient jusqu'au lendemain. L'huile en elle-même nourrit bien les pointes." },
      { d: 161, r: 5, a: 'Sophie L.', v: true, h: 3, b: "Certifiée NATRUE, un seul flacon dure des mois. Mes pointes ne fourchent plus depuis que j'ai pris l'habitude." },
    ],
  },
  {
    target_type: 'product', target_slug: 'sebamed-everyday-shampoo', // moyenne visée 4.2
    items: [
      { d: 20, r: 5, a: 'Julie M.', v: true, h: 8, t: "Toute la famille l'utilise", b: "Cheveux lavés tous les jours pour mon mari qui fait du sport, et cuir chevelu sensible pour moi. Ce shampoing convient aux deux, sans irritation ni cheveux qui regraissent trop vite." },
      { d: 36, r: 4, a: 'Nicolas L.', v: true, h: 4, b: "Très doux, parfait pour des lavages quotidiens. En revanche il ne fait pas grand-chose sur les cheveux vraiment abîmés." },
      { d: 50, r: 3, a: 'Elodie V.', v: true, h: 5, b: "Correct mais il mousse peu et je dois en mettre deux fois pour des cheveux longs. Le flacon part vite." },
      { d: 77, r: 5, a: 'Camille T.', v: false, h: 3, b: "Le pH 5.5 fait la différence : mon cuir chevelu ne tiraille plus après le lavage, ce qui arrivait avec les shampoings de supermarché." },
      { d: 121, r: 3, a: 'Hugo D.', v: true, h: 2, b: "Neutre et sans caractère. Ça lave, c'est doux, il ne faut pas en attendre plus." },
      { d: 187, r: 5, a: 'Manon G.', v: true, h: 2, b: "Utilisé sur les cheveux de mes enfants, aucun picotement dans les yeux et il démêle correctement." },
    ],
  },
  // ===================== BIEN-ÊTRE =====================
  {
    target_type: 'product', target_slug: 'doppelherz-magnesium-400', // moyenne visée 4.5
    items: [
      { d: 4, r: 5, a: 'Camille T.', v: true, h: 18, t: "Fini les crampes nocturnes", b: "Je me réveillais deux à trois fois par semaine avec des crampes aux mollets. Un comprimé le soir au dîner et depuis un mois, plus rien. La B12 en plus est un bon complément quand on mange peu de viande." },
      { d: 8, r: 5, a: 'Pauline R.', v: true, h: 11, b: "Période d'examens très stressante, je dormais mal et j'avais les paupières qui sautaient. Trois semaines de cure et tout est rentré dans l'ordre." },
      { d: 14, r: 4, a: 'Marc V.', v: true, h: 6, b: "Efficace sur la récupération après le sport. Les comprimés sont gros et un peu difficiles à avaler, c'est mon seul reproche." },
      { d: 22, r: 5, a: 'Nadia K.', v: false, h: 8, b: "7 euros la boîte pour deux mois, imbattable. J'ai comparé les dosages, 400 mg c'est l'apport journalier recommandé, pas besoin de payer plus cher ailleurs." },
      { d: 31, r: 5, a: 'Youssef E.', v: true, h: 5, b: "Pris le soir, ça aide aussi à l'endormissement. Effet secondaire bienvenu que je ne cherchais pas au départ." },
      { d: 43, r: 3, a: 'Sabrina M.', v: true, h: 9, t: "Troubles digestifs les premiers jours", b: "Efficace sur la fatigue, mais j'ai eu le ventre dérangé la première semaine. En le prenant au milieu du repas ça s'est arrangé, il faut le savoir." },
      { d: 62, r: 5, a: 'Grégoire M.', v: true, h: 4, b: "Cure de trois mois recommandée par mon médecin après une prise de sang. Le taux est remonté et la fatigue de fin de journée a nettement diminué." },
      { d: 84, r: 4, a: 'Léa N.', v: true, h: 3, b: "Bon produit, mais je préfère la forme bisglycinate pour la tolérance digestive. Celui-ci reste très correct pour le prix." },
      { d: 116, r: 5, a: 'Farid H.', v: false, h: 2, b: "Best-seller allemand, on comprend pourquoi. Simple, dosé correctement, sans additifs inutiles." },
      { d: 178, r: 4, a: 'Amélie R.', v: true, h: 3, b: "Je fais deux cures d'un mois par an, à l'automne et au printemps. C'est devenu une habitude qui me réussit." },
    ],
  },
  {
    target_type: 'product', target_slug: 'doppelherz-vitamin-d3-2000', // moyenne visée 4.6
    items: [
      { d: 12, r: 5, a: 'Nicolas L.', v: true, h: 14, t: "Taux remonté en trois mois", b: "Carence confirmée par prise de sang en novembre, 18 ng/ml. Un comprimé tous les deux jours pendant trois mois et je suis remonté à 42 ng/ml. Le médecin a validé le dosage." },
      { d: 26, r: 5, a: 'Salima B.', v: true, h: 8, b: "Petits comprimés faciles à avaler, sans goût. Je les prends d'octobre à avril comme conseillé et je passe l'hiver sans coup de fatigue." },
      { d: 40, r: 4, a: 'Théo C.', v: true, h: 5, b: "Bon dosage et prix correct. J'aurais préféré une forme huileuse pour l'absorption, mais avec un repas gras ça fonctionne bien." },
      { d: 65, r: 5, a: 'Charlotte D.', v: false, h: 4, b: "Toute la famille en prend l'hiver, sur avis du médecin traitant. Moins de rhumes cette saison, difficile de savoir si c'est lié mais je continue." },
      { d: 93, r: 3, a: 'Hugo D.', v: true, h: 6, t: "Attention à ne pas se doser soi-même", b: "Le produit est très bien, mais 2000 U.I. tous les jours sans contrôle sanguin, ce n'est pas anodin. J'aurais aimé un rappel plus visible sur la boîte." },
      { d: 138, r: 5, a: 'Fatima Z.', v: true, h: 3, b: "Norme pharmaceutique allemande, boîte de 45 comprimés qui dure trois mois. Rapport qualité-prix excellent." },
      { d: 182, r: 5, a: 'Bastien R.', v: true, h: 2, b: "Deuxième hiver avec, mes analyses restent stables. Je n'ai rien d'autre à demander à un complément." },
    ],
  },
  {
    target_type: 'product', target_slug: 'doppelherz-melatonin-spray', // moyenne visée 4.3
    items: [
      { d: 7, r: 5, a: 'Pauline R.', v: true, h: 13, t: "Décalage horaire réglé", b: "Vol vers Montréal, six heures de décalage. Deux pulvérisations avant le coucher les trois premiers soirs et je me suis calée sur l'heure locale sans nuit blanche. Le goût lavande-mélisse est agréable." },
      { d: 18, r: 5, a: 'Inès F.', v: true, h: 9, b: "L'endormissement est plus rapide, environ vingt minutes au lieu d'une heure. Je l'utilise ponctuellement, pas tous les soirs, comme recommandé." },
      { d: 32, r: 4, a: 'Vincent T.', v: true, h: 5, b: "Efficace mais le flacon est petit pour 10 euros. Le format spray reste plus pratique qu'un comprimé quand on n'a pas d'eau sous la main." },
      { d: 55, r: 4, a: 'Amina S.', v: false, h: 4, b: "Ça m'aide à m'endormir mais je me réveille toujours vers quatre heures. La mélatonine agit sur l'endormissement, pas sur le maintien du sommeil, c'était à moi de le savoir." },
      { d: 87, r: 3, a: 'Marc V.', v: true, h: 7, t: "Effet léger dans mon cas", b: "Un milligramme, c'est peu, et sur moi l'effet est à peine perceptible. J'ai dû revoir mes horaires d'écran, ce qui a plus changé les choses que le spray." },
      { d: 144, r: 5, a: 'Nora T.', v: true, h: 3, b: "Utilisé pendant une période de travail de nuit, il m'a permis de dormir en journée. Sans accoutumance ressentie à l'arrêt." },
    ],
  },
  {
    target_type: 'product', target_slug: 'kneipp-valeriane-nuit', // moyenne visée 4.2
    items: [
      { d: 16, r: 5, a: 'Claire D.', v: true, h: 10, t: "Une détente réelle avant le coucher", b: "Deux dragées une heure avant d'aller me coucher, et je sens que le mental redescend. Ce n'est pas un somnifère, c'est plus subtil, mais mes nuits sont plus calmes depuis un mois." },
      { d: 34, r: 4, a: 'Sophie L.', v: true, h: 6, b: "Effet progressif : rien la première semaine, puis un vrai mieux au bout de dix jours. Il faut être patient avec les plantes." },
      { d: 51, r: 3, a: 'Antoine B.', v: true, h: 8, t: "L'odeur des dragées", b: "La valériane sent fort dès l'ouverture du flacon, un peu comme des vieilles chaussettes, c'est connu mais ça surprend. L'effet sur moi reste modeste." },
      { d: 78, r: 5, a: 'Delphine A.', v: false, h: 4, b: "Je l'utilise en alternance avec la tisane du soir. Aucune sensation de tête lourde au réveil, contrairement aux somnifères." },
      { d: 112, r: 3, a: 'Youssef E.', v: true, h: 3, b: "Correct mais 11,50 euros pour un mois de cure, il y a moins cher en pharmacie à dosage équivalent." },
      { d: 166, r: 5, a: 'Émilie C.', v: true, h: 2, b: "500 mg d'extrait de racine, c'est un dosage sérieux. Utilisé pendant une période de stress au travail, ça m'a aidée à décrocher le soir." },
    ],
  },
  {
    target_type: 'product', target_slug: 'kneipp-huile-bain-relax', // moyenne visée 4.6
    items: [
      { d: 5, r: 5, a: 'Émilie C.', v: true, h: 15, t: "Mon rituel du dimanche soir", b: "Un bouchon dans un bain chaud, quinze minutes, et les tensions des épaules disparaissent. L'huile de lavande et de patchouli embaume toute la salle de bain sans être écœurante." },
      { d: 13, r: 5, a: 'Sophie L.', v: true, h: 10, b: "La peau ne tiraille pas après le bain, au contraire elle est douce. C'est rare pour un produit de bain qui parfume autant." },
      { d: 25, r: 5, a: 'Nadia K.', v: false, h: 7, b: "Offert à ma mère qui a des douleurs de dos, elle m'a demandé où l'acheter dès la deuxième semaine." },
      { d: 37, r: 4, a: 'Bastien R.', v: true, h: 4, b: "Excellent produit, mais la baignoire est glissante après, attention en sortant. Le flacon de 100 ml dure environ dix bains." },
      { d: 59, r: 5, a: 'Manon G.', v: true, h: 6, b: "L'hydrothérapie selon Kneipp, ce n'est pas qu'un slogan : le bain chaud plus la lavande, ça marche vraiment sur l'endormissement." },
      { d: 92, r: 3, a: 'Nicolas L.', v: true, h: 5, t: "Trop parfumé pour moi", b: "Le patchouli est très présent et je le sens encore le lendemain sur la peau. Détente réelle en revanche, je reconnais l'effet." },
      { d: 129, r: 5, a: 'Charlotte D.', v: true, h: 3, b: "J'en mets quelques gouttes sur le sol de la douche à défaut de baignoire, la vapeur diffuse les huiles essentielles. Ça fonctionne aussi." },
      { d: 174, r: 5, a: 'Amina S.', v: true, h: 2, b: "Le meilleur cadeau à moins de dix euros. Troisième flacon acheté, jamais déçue." },
    ],
  },
  {
    target_type: 'product', target_slug: 'salus-floradix-fer', // moyenne visée 4.4
    items: [
      { d: 9, r: 5, a: 'Fatima Z.', v: true, h: 16, t: "Ma ferritine est remontée sans troubles digestifs", b: "Les comprimés de fer classiques me constipaient systématiquement. Avec ce tonique liquide, aucun souci et ma ferritine est passée de 12 à 38 en quatre mois. Le goût est un peu sucré mais très supportable." },
      { d: 21, r: 5, a: 'Léa N.', v: true, h: 9, b: "Une cuillère matin et soir avant les repas. La fatigue de milieu d'après-midi a nettement reculé au bout de trois semaines." },
      { d: 38, r: 5, a: 'Yasmine H.', v: false, h: 6, b: "La vitamine C dans la formule aide vraiment à l'absorption du fer. C'est ce qui m'a décidée face aux autres produits." },
      { d: 56, r: 4, a: 'Julie M.', v: true, h: 4, b: "Efficace, mais il faut conserver le flacon au frais après ouverture et le finir en quatre semaines. Un peu contraignant en voyage." },
      { d: 81, r: 2, a: 'Camille T.', v: true, h: 10, t: "Le goût ne passe pas", b: "Je n'ai pas réussi à finir le flacon, le goût de plantes et de fer me soulevait le cœur le matin. C'est très personnel, mais autant le savoir avant d'acheter." },
      { d: 127, r: 5, a: 'Salima B.', v: true, h: 3, b: "Utilisé pendant l'allaitement avec l'accord de la sage-femme. Bien toléré et efficace sur la fatigue." },
      { d: 190, r: 5, a: 'Elodie V.', v: true, h: 2, b: "Règles abondantes, ferritine chroniquement basse. Deux cures par an avec ce tonique et je tiens la saison sans coup de pompe." },
    ],
  },
  {
    target_type: 'product', target_slug: 'salus-tisane-fenouil-bio', // moyenne visée 4.5
    items: [
      { d: 11, r: 5, a: 'Sabrina M.', v: true, h: 11, t: "Le réflexe après les repas lourds", b: "Ballonnements systématiques après le dîner, une tasse de cette tisane et ça se dénoue en vingt minutes. Naturellement sucrée, pas besoin d'ajouter quoi que ce soit." },
      { d: 23, r: 5, a: 'Grégoire M.', v: true, h: 7, b: "Qualité Demeter à 4,50 euros les vingt sachets, difficile de faire mieux. Le goût est doux, très loin des tisanes fades du supermarché." },
      { d: 44, r: 5, a: 'Nadia K.', v: false, h: 5, b: "Donnée à mon bébé de huit mois diluée, sur conseil du pédiatre, contre les coliques. Ça l'a nettement soulagé." },
      { d: 71, r: 4, a: 'Théo C.', v: true, h: 3, b: "Bonne tisane digestive, mais il faut vraiment laisser infuser huit à dix minutes, sinon le goût est trop léger et l'effet aussi." },
      { d: 106, r: 3, a: 'Rachid O.', v: true, h: 4, b: "Correct mais je n'aime pas le goût anisé du fenouil, c'est une question de goût. L'effet digestif est bien là." },
      { d: 159, r: 5, a: 'Manon G.', v: true, h: 2, b: "Sachets individuels bien emballés, l'arôme reste intact jusqu'au dernier. Je commande par trois boîtes." },
    ],
  },
  {
    target_type: 'product', target_slug: 'salus-tisane-nuit-paisible', // moyenne visée 4.3
    items: [
      { d: 15, r: 5, a: 'Amélie R.', v: true, h: 12, t: "Un vrai signal d'endormissement", b: "Infusée dix minutes, bue une demi-heure avant le coucher : plus que la valériane elle-même, c'est le rituel qui m'aide à décrocher des écrans. Trois semaines et mon endormissement est passé de quarante-cinq à quinze minutes." },
      { d: 28, r: 4, a: 'Inès F.', v: true, h: 6, b: "Bonne tisane du soir, mélange équilibré. Le goût de valériane est présent mais la mélisse l'adoucit bien." },
      { d: 47, r: 5, a: 'Julie M.', v: false, h: 5, b: "Je la préfère aux gélules : moins dosée mais plus agréable, et l'effet est suffisant pour mes difficultés d'endormissement passagères." },
      { d: 74, r: 3, a: 'Farid H.', v: true, h: 7, t: "Effet limité chez moi", b: "Agréable au goût, mais sur mon insomnie de fond ça ne change rien. Pour un stress léger de fin de journée, ça peut suffire." },
      { d: 111, r: 4, a: 'Nora T.', v: true, h: 3, b: "Bio, sans arômes ajoutés, c'est ce que je cherchais. J'ajoute une cuillère de miel et c'est parfait." },
      { d: 172, r: 5, a: 'Claire D.', v: true, h: 2, b: "Le duo tisane du soir plus bain à la lavande a réglé mes fins de journée agitées. Deux produits simples et pas chers." },
    ],
  },
  // ===================== MARQUES =====================
  {
    target_type: 'brand', target_slug: 'weleda',
    items: [
      { d: 17, r: 5, a: 'Sophie L.', v: true, h: 14, t: "Une constance rare", b: "J'utilise des produits Weleda depuis quinze ans. Les formules évoluent peu, les compositions restent lisibles et certifiées NATRUE. C'est une marque sur laquelle je n'ai jamais eu de mauvaise surprise." },
      { d: 33, r: 5, a: 'Claire D.', v: true, h: 9, b: "Le rapport qualité-prix du bio le plus honnête que je connaisse. Skin Food, lait nettoyant, huile capillaire : trois produits, aucune déception." },
      { d: 52, r: 4, a: 'Léa N.', v: false, h: 5, b: "Très bonne marque, mais les huiles essentielles sont présentes dans presque tous les produits. Pour les peaux très réactives ce n'est pas toujours idéal." },
      { d: 88, r: 5, a: 'Fatima Z.', v: true, h: 6, b: "Marque suisse à l'origine, fabrication européenne, engagement démontré sur les filières de plantes. Ce n'est pas du greenwashing, ça se vérifie." },
      { d: 134, r: 4, a: 'Hugo D.', v: true, h: 3, b: "Les soins visage sont excellents, la gamme homme est plus quelconque. À choisir produit par produit plutôt qu'en confiance aveugle." },
      { d: 195, r: 5, a: 'Amina S.', v: true, h: 4, b: "Le calendula bébé nous a accompagnés pour nos deux enfants sans le moindre problème. Fidèle depuis." },
    ],
  },
  {
    target_type: 'brand', target_slug: 'eucerin',
    items: [
      { d: 20, r: 5, a: 'Delphine A.', v: true, h: 12, t: "La rigueur dermatologique allemande", b: "Ce que j'apprécie chez Eucerin, ce sont les études cliniques derrière chaque gamme. Le Thiamidol sur les taches, l'urée sur le cuir chevelu sec : à chaque fois il y a de la publication scientifique, pas juste un argument commercial." },
      { d: 41, r: 5, a: 'Yasmine H.', v: true, h: 8, b: "Trois produits de la marque dans ma routine, aucune irritation malgré une peau réactive. Les textures sont sobres, sans surparfumage." },
      { d: 76, r: 4, a: 'Nicolas L.', v: true, h: 5, b: "Qualité constante, mais les prix ont sensiblement augmenté ces dernières années. Ça reste en dessous du luxe pour une efficacité supérieure." },
      { d: 120, r: 4, a: 'Salima B.', v: false, h: 3, b: "Gammes bien pensées et complètes. Le seul défaut : il faut s'y retrouver entre DermoPure, Hyaluron-Filler, Anti-Pigment et compagnie." },
      { d: 181, r: 5, a: 'Julie M.', v: true, h: 4, b: "Conseillée par deux dermatologues différents, à dix ans d'intervalle. C'est le meilleur gage de sérieux à mes yeux." },
    ],
  },
  {
    target_type: 'brand', target_slug: 'sebamed',
    items: [
      { d: 29, r: 5, a: 'Karim B.', v: true, h: 10, t: "Le pH 5.5 comme fil conducteur", b: "Toute la gamme est construite autour du respect du manteau acide, et ça se sent à l'usage : jamais de peau qui tiraille, jamais de cuir chevelu qui gratte. Et les prix restent raisonnables." },
      { d: 64, r: 4, a: 'Manon G.', v: true, h: 6, b: "Excellent pour les peaux sensibles et les enfants. Les produits anti-âge de la marque sont en revanche moins convaincants." },
      { d: 107, r: 4, a: 'Émilie C.', v: false, h: 4, b: "Marque fiable et accessible, sans marketing tapageur. Les textures manquent parfois d'élégance mais l'efficacité est là." },
      { d: 163, r: 5, a: 'Antoine B.', v: true, h: 3, b: "Utilisée par toute la famille, du nettoyant au shampoing. Aucun produit ne nous a déçus en cinq ans." },
    ],
  },
  {
    target_type: 'brand', target_slug: 'alpecin',
    items: [
      { d: 26, r: 4, a: 'Thomas P.', v: true, h: 11, t: "Efficace si l'on comprend ce que ça fait", b: "Alpecin ne fait pas repousser les cheveux, la marque le dit d'ailleurs assez honnêtement : elle ralentit la chute héréditaire. En prenant les produits pour ce qu'ils sont, on n'est pas déçu." },
      { d: 58, r: 5, a: 'Farid H.', v: true, h: 7, b: "Le duo shampoing plus tonique caféine est cohérent et bien pensé. Prix accessible pour un usage quotidien sur la durée." },
      { d: 99, r: 3, a: 'Vincent T.', v: true, h: 8, b: "Communication un peu trop confiante à mon goût pour des preuves cliniques de niveau modéré. Les produits sont corrects, la promesse est surjouée." },
      { d: 152, r: 5, a: 'Mehdi A.', v: false, h: 4, b: "Numéro un en Allemagne depuis des années, et pour une fois ce n'est pas usurpé. Six mois d'utilisation, chute stabilisée." },
    ],
  },
  {
    target_type: 'brand', target_slug: 'doppelherz',
    items: [
      { d: 35, r: 5, a: 'Grégoire M.', v: true, h: 9, t: "Des compléments simples et bien dosés", b: "Pas de formules fourre-tout à vingt ingrédients : un actif, un dosage clair, un prix bas. Le magnésium et la vitamine D3 sont dans mon armoire à pharmacie depuis trois ans." },
      { d: 69, r: 4, a: 'Nadia K.', v: true, h: 5, b: "Bon rapport qualité-prix, mais certaines gammes contiennent des édulcorants et des arômes dont je me passerais volontiers." },
      { d: 113, r: 5, a: 'Bastien R.', v: false, h: 3, b: "Normes pharmaceutiques allemandes, traçabilité claire des lots. Pour un complément, c'est ce qui compte le plus." },
      { d: 177, r: 4, a: 'Pauline R.', v: true, h: 2, b: "Large choix, parfois trop : on ne sait pas toujours quelle gamme choisir entre deux références proches." },
    ],
  },
  // ===================== INGRÉDIENTS =====================
  {
    target_type: 'ingredient', target_slug: 'niacinamide',
    items: [
      { d: 18, r: 5, a: 'Amélie R.', v: false, h: 16, t: "L'actif le plus facile à vivre", b: "Un an de niacinamide à 5% matin et soir : sébum régulé, pores resserrés sur le nez, zéro irritation. C'est l'actif que je conseille à tous ceux qui débutent." },
      { d: 45, r: 5, a: 'Lucas G.', v: false, h: 9, b: "Compatible avec presque tout, y compris la vitamine C malgré ce qu'on lit partout. Aucun problème en un an d'utilisation simultanée." },
      { d: 83, r: 4, a: 'Chloé P.', v: false, h: 6, b: "Très bien toléré, mais au-delà de 10% j'ai eu des rougeurs. Inutile de courir après les fortes concentrations." },
      { d: 130, r: 4, a: 'Théo C.', v: false, h: 4, b: "Efficace sur les marques post-acné, plus lent sur les taches solaires. Résultats visibles après huit à dix semaines dans mon cas." },
      { d: 185, r: 5, a: 'Manon G.', v: false, h: 3, b: "Beaucoup d'études solides derrière cet actif, ce qui n'est pas si courant en cosmétique. Ma peau confirme." },
    ],
  },
  {
    target_type: 'ingredient', target_slug: 'retinol',
    items: [
      { d: 22, r: 5, a: 'Delphine A.', v: false, h: 14, t: "Puissant, à condition d'y aller lentement", b: "Deux soirs par semaine pendant un mois, puis trois, puis un soir sur deux. C'est la seule façon de tenir sur la durée. Après six mois, le grain de peau et les ridules sont transformés." },
      { d: 61, r: 4, a: 'Sabrina M.', v: false, h: 8, b: "Résultats réels mais la phase d'adaptation est pénible : rougeurs, desquamation, peau qui tiraille pendant trois semaines." },
      { d: 118, r: 3, a: 'Youssef E.', v: false, h: 7, b: "Efficace, mais l'obligation de SPF quotidien et l'incompatibilité avec les acides compliquent la routine. À réserver à ceux qui sont réguliers." },
      { d: 169, r: 5, a: 'Charlotte D.', v: false, h: 5, b: "Le seul actif anti-âge avec autant de recul clinique. Les alternatives douces sont plus confortables mais moins efficaces, il faut choisir." },
    ],
  },
  {
    target_type: 'ingredient', target_slug: 'acide-hyaluronique',
    items: [
      { d: 30, r: 5, a: 'Inès F.', v: false, h: 11, t: "À appliquer sur peau humide, sinon ça dessèche", b: "L'erreur que j'ai faite pendant des mois : l'appliquer sur peau sèche dans un appartement chauffé. L'acide hyaluronique va alors puiser l'eau dans la peau. Sur peau humide et avec une crème par-dessus, tout change." },
      { d: 72, r: 5, a: 'Salima B.', v: false, h: 7, b: "Le double poids moléculaire fait la différence : surface et couches plus profondes. C'est ce qu'il faut regarder sur l'étiquette." },
      { d: 125, r: 4, a: 'Nicolas L.', v: false, h: 4, b: "Bon hydratant, mais ce n'est pas un actif anti-rides. Il repulpe par l'hydratation, ce qui est déjà bien, sans plus." },
      { d: 188, r: 4, a: 'Amina S.', v: false, h: 3, b: "Présent partout et à toutes les concentrations. La concentration compte moins que la formule complète autour." },
    ],
  },
  {
    target_type: 'ingredient', target_slug: 'cafeine',
    items: [
      { d: 27, r: 4, a: 'Thomas P.', v: false, h: 10, t: "Utile en prévention, pas en traitement", b: "Les études montrent un effet sur le follicule, mais modéré. Sur une chute qui débute, ça vaut le coup ; sur une calvitie installée, il ne faut pas espérer de miracle." },
      { d: 66, r: 4, a: 'Marc V.', v: false, h: 6, b: "Le temps de contact compte plus que la concentration : deux minutes de pose minimum, sinon autant ne rien faire." },
      { d: 121, r: 3, a: 'Vincent T.', v: false, h: 5, b: "Beaucoup de promesses marketing autour de cet actif pour un niveau de preuve encore limité. Je reste prudent." },
      { d: 179, r: 5, a: 'Mehdi A.', v: false, h: 4, b: "Sur le cuir chevelu, l'effet stimulant est perceptible dès l'application. Six mois d'usage quotidien et ma chute saisonnière a été bien plus discrète." },
    ],
  },
  {
    target_type: 'ingredient', target_slug: 'magnesium',
    items: [
      { d: 39, r: 5, a: 'Camille T.', v: false, h: 9, t: "La forme compte autant que le dosage", b: "Oxyde de magnésium bon marché mais peu assimilé et laxatif, bisglycinate mieux toléré, citrate entre les deux. Regardez la forme sur l'étiquette avant le nombre de milligrammes." },
      { d: 95, r: 4, a: 'Pauline R.', v: false, h: 5, b: "Efficace sur les crampes et la nervosité, moins évident sur le sommeil dans mon cas. À prendre au repas pour éviter les désagréments digestifs." },
      { d: 157, r: 5, a: 'Youssef E.', v: false, h: 3, b: "Associé à la vitamine B6 ou B12, l'effet sur la fatigue est plus net. Une cure de trois mois suffit généralement." },
    ],
  },
]

// Aplatit REVIEW_SETS vers le format attendu par l'insertion en base.
export function buildReviews() {
  return REVIEW_SETS.flatMap((set) =>
    set.items.map((it) => ({
      target_type: set.target_type,
      target_slug: set.target_slug,
      author_name: it.a,
      rating: it.r,
      title: it.t || '',
      body: it.b,
      verified: !!it.v,
      helpful: it.h || 0,
      lang: 'fr',
      days_ago: it.d,
    }))
  )
}

// ---- Questions / Réponses par produit ----------------------------------
// Vraies questions d'acheteurs : usage, tolérance, associations, précautions.
// Les réponses de l'équipe restent factuelles et renvoient vers un
// professionnel de santé dès qu'il s'agit de grossesse, d'enfants ou de
// traitements en cours. Quelques questions récentes sont volontairement
// laissées sans réponse, comme sur un vrai fil de discussion.
export const SEED_QUESTIONS = [
  // ---- Skincare ----
  {
    product_slug: 'weleda-skin-food', author_name: 'Julie M.', lang: 'fr', days_ago: 40,
    body: "Est-ce que la Skin Food convient aussi pour le corps et les mains très sèches, ou uniquement le visage ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 39, body: "Oui, la Skin Food est polyvalente : visage, mains, coudes et talons. Sur le visage, une petite quantité suffit car la texture est riche ; réchauffez-la entre les doigts avant d'appliquer." },
      { author_name: 'Marc V.', is_staff: false, lang: 'fr', days_ago: 38, body: "Je l'utilise sur les mains l'hiver, c'est radical contre les gerçures. Le petit tube tient dans une poche de veste." },
    ],
  },
  {
    product_slug: 'weleda-skin-food', author_name: 'Karim B.', lang: 'fr', days_ago: 22,
    body: "La texture est-elle grasse ? J'ai la peau mixte et j'ai peur que ça brille.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 21, body: "La texture est riche et donc plutôt destinée aux peaux sèches à normales. Sur peau mixte, réservez-la aux zones sèches (joues, contour du nez) plutôt qu'à la zone T, ou gardez-la pour le soir." },
      { author_name: 'Sabrina M.', is_staff: false, lang: 'fr', days_ago: 19, body: "Confirmé : sur tout le visage j'ai eu des microkystes en zone T. Sur les joues uniquement, aucun souci." },
    ],
  },
  {
    product_slug: 'weleda-skin-food', author_name: 'Léa N.', lang: 'fr', days_ago: 13,
    body: "Le produit est-il vegan ? Je ne trouve pas l'information sur l'emballage.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 12, body: "Non : la formule originale contient de la lanoline (issue de la laine de mouton) et de la cire d'abeille. Elle est certifiée naturelle NATRUE mais pas végane. À noter aussi pour les personnes allergiques à la lanoline." },
    ],
  },
  {
    product_slug: 'eucerin-hyaluron-filler-serum', author_name: 'Nadia K.', lang: 'fr', days_ago: 30,
    body: "Peut-on utiliser ce sérum matin ET soir, et avant ou après la crème hydratante ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 29, body: "Oui, matin et soir. On applique toujours le sérum AVANT la crème (du plus fluide au plus riche), sur peau propre et légèrement humide pour que l'acide hyaluronique capte l'eau en surface plutôt que dans la peau." },
    ],
  },
  {
    product_slug: 'eucerin-hyaluron-filler-serum', author_name: 'Charlotte D.', lang: 'fr', days_ago: 16,
    body: "Puis-je l'associer à un sérum au rétinol le soir, ou faut-il alterner les soirs ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 15, body: "Les deux se combinent très bien : l'acide hyaluronique est un hydratant, pas un acide, et il n'y a pas de conflit de pH. Appliquez le sérum hyaluronique en premier, le rétinol ensuite — cela limite même la sensation de sécheresse liée au rétinol." },
      { author_name: 'Delphine A.', is_staff: false, lang: 'fr', days_ago: 14, body: "C'est exactement ma routine depuis six mois : hyaluronique puis rétinol, et une crème par-dessus. Bien mieux toléré que le rétinol seul." },
    ],
  },
  {
    product_slug: 'nivea-luminous630-serum', author_name: 'Fatima Z.', lang: 'fr', days_ago: 34,
    body: "Ce sérum est-il compatible avec une grossesse ? J'ai un masque de grossesse justement.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 33, body: "L'actif Luminous630 n'est pas un rétinoïde et ne fait pas partie des ingrédients déconseillés pendant la grossesse, mais nous ne pouvons pas nous substituer à un avis médical : demandez confirmation à votre sage-femme ou votre médecin. Dans tous les cas, la protection solaire quotidienne reste la mesure la plus efficace contre le mélasma." },
    ],
  },
  {
    product_slug: 'nivea-luminous630-serum', author_name: 'Théo C.', lang: 'fr', days_ago: 11,
    body: "Au bout de combien de temps voit-on quelque chose sur les taches ? J'en suis à trois semaines et je ne vois rien.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 10, body: "Les études de la marque parlent de premiers résultats à 4 semaines et d'un effet net vers 8 à 12 semaines, en application biquotidienne. Trois semaines, c'est encore tôt. Sans SPF quotidien en revanche, les résultats seront décevants quelle que soit la durée." },
      { author_name: 'Amina S.', is_staff: false, lang: 'fr', days_ago: 8, body: "Chez moi c'est vers la sixième semaine que ça a commencé à se voir, et surtout au troisième mois. Patience !" },
    ],
  },
  {
    product_slug: 'sebamed-clear-face-gel', author_name: 'Chloé P.', lang: 'fr', days_ago: 27,
    body: "Est-ce qu'il démaquille, ou faut-il un démaquillant avant ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 26, body: "C'est un nettoyant, pas un démaquillant : il retire un maquillage léger, mais pour un fond de teint longue tenue ou un maquillage des yeux, prévoyez un double nettoyage (huile ou eau micellaire d'abord, ce gel ensuite)." },
    ],
  },
  {
    product_slug: 'sebamed-clear-face-gel', author_name: 'Sabrina M.', lang: 'fr', days_ago: 9,
    body: "Mon fils a 15 ans et une acné débutante. Ce gel convient-il à un adolescent en usage quotidien ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 8, body: "Oui, c'est typiquement l'usage visé : nettoyage doux au pH 5.5, matin et soir, sans décaper. Si l'acné est inflammatoire (boutons rouges douloureux, nombreux), un nettoyant ne suffira pas et une consultation dermatologique s'impose." },
    ],
  },
  {
    product_slug: 'eucerin-dermopure-serum', author_name: 'Camille T.', lang: 'fr', days_ago: 21,
    body: "J'ai plus de boutons depuis que j'ai commencé, est-ce normal ? Dois-je arrêter ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 20, body: "Une phase d'ajustement de 2 à 4 semaines est fréquente avec l'acide salicylique : le renouvellement cellulaire accéléré fait remonter des microkystes déjà présents. Si cela dépasse un mois, si la peau brûle ou pèle beaucoup, espacez à un soir sur deux ou arrêtez et demandez un avis dermatologique." },
      { author_name: 'Lucas G.', is_staff: false, lang: 'fr', days_ago: 18, body: "J'ai eu exactement ça pendant dix jours, puis tout s'est calmé. Tenir bon a valu le coup dans mon cas." },
    ],
  },
  {
    product_slug: 'eucerin-dermopure-serum', author_name: 'Yasmine H.', lang: 'fr', days_ago: 6,
    body: "Peut-on l'utiliser en même temps qu'un traitement prescrit au peroxyde de benzoyle ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 5, body: "Cumuler acide salicylique et peroxyde de benzoyle sur la même zone au même moment risque d'irriter fortement. Si votre dermatologue a prescrit le peroxyde, c'est lui qui prime : demandez-lui s'il valide une alternance (traitement le soir, sérum le matin, ou un jour sur deux)." },
    ],
  },
  {
    product_slug: 'eucerin-sun-oil-control-spf50', author_name: 'Émilie C.', lang: 'fr', days_ago: 18,
    body: "Comment renouveler l'application en journée quand on est maquillée ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 17, body: "Sur maquillage, les formats brume ou stick sont les plus pratiques : ils ne remplacent pas parfaitement une application pleine dose, mais mieux vaut une réapplication imparfaite que pas de réapplication du tout. En intérieur derrière une fenêtre, une seule application le matin suffit généralement." },
      { author_name: 'Inès F.', is_staff: false, lang: 'fr', days_ago: 15, body: "J'utilise une brume SPF à midi par-dessus le maquillage, ça ne fait pas de traces sur un fini mat." },
    ],
  },
  {
    product_slug: 'dr-hauschka-creme-jour-rose', author_name: 'Manon G.', lang: 'fr', days_ago: 24,
    body: "J'ai de la rosacée. Les huiles essentielles de rose risquent-elles de déclencher des rougeurs ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 23, body: "C'est possible : les extraits de rose sont apaisants pour beaucoup de peaux réactives, mais une rosacée peut réagir aux composants parfumants naturels (geraniol, citronellol, linalol figurent en fin d'INCI). Faites un test 48 h dans le pli du coude, et en cas de rosacée diagnostiquée, orientez-vous plutôt vers une crème sans parfum." },
    ],
  },
  {
    product_slug: 'nivea-sun-uv-face-spf50', author_name: 'Nora T.', lang: 'fr', days_ago: 12,
    body: "Les filtres sont-ils minéraux ou chimiques ? Je cherche une protection pour un enfant de 5 ans.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 11, body: "Ce sont des filtres organiques (dits chimiques), sans parfum ni alcool. Pour un enfant de 5 ans, préférez une formule spécifiquement destinée aux enfants : les gammes enfant sont testées pour une peau plus fine et souvent plus résistantes à l'eau." },
    ],
  },
  {
    product_slug: 'eucerin-vitamin-c-booster', author_name: 'Salima B.', lang: 'fr', days_ago: 19,
    body: "Combien de temps se conserve le sérum une fois la poudre de vitamine C activée ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 18, body: "Environ 4 semaines après activation, conservé à l'abri de la lumière et de la chaleur. C'est le principe de ce format : la vitamine C pure s'oxyde vite en solution, d'où le mélange au dernier moment. Si le liquide vire à l'orange foncé, la vitamine C s'est dégradée." },
    ],
  },
  {
    product_slug: 'borlind-retinol-nature-serum', author_name: 'Elodie V.', lang: 'fr', days_ago: 26,
    body: "À quelle fréquence commencer quand on n'a jamais utilisé de rétinol ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 25, body: "Deux soirs par semaine pendant trois à quatre semaines, puis trois soirs, puis un soir sur deux si la peau suit. Toujours sur peau sèche, en couche fine, avec une crème par-dessus, et un SPF systématique le matin. Si la peau pèle, on redescend d'un cran plutôt que d'arrêter complètement." },
      { author_name: 'Charlotte D.', is_staff: false, lang: 'fr', days_ago: 22, body: "La méthode sandwich m'a beaucoup aidée : crème, puis rétinol, puis crème. L'adaptation est bien plus douce." },
    ],
  },
  {
    product_slug: 'borlind-retinol-nature-serum', author_name: 'Fatima Z.', lang: 'fr', days_ago: 7,
    body: "Je suis enceinte de 4 mois, puis-je continuer à l'utiliser ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 6, body: "Non : par principe de précaution, tous les rétinoïdes cosmétiques (rétinol, rétinal, esters de rétinyle) sont déconseillés pendant la grossesse et l'allaitement. Mettez le sérum de côté et reprenez après, en en parlant à votre médecin. Pour l'éclat et les ridules, la vitamine C et la niacinamide sont des alternatives sans restriction connue." },
    ],
  },
  {
    product_slug: 'sebamed-anti-age-q10', author_name: 'Léa N.', lang: 'fr', days_ago: 15,
    body: "À partir de quel âge est-il utile de passer à une crème anti-âge ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 14, body: "Il n'y a pas d'âge « officiel ». Ce qui compte, c'est l'apparition des premiers signes (ridules de déshydratation, teint moins uniforme), souvent entre 25 et 35 ans. Le geste le plus rentable avant tout cela reste le SPF quotidien, loin devant n'importe quelle crème." },
    ],
  },
  {
    product_slug: 'weleda-lotion-nettoyante-douce', author_name: 'Amina S.', lang: 'fr', days_ago: 20,
    body: "Faut-il rincer le lait à l'eau, ou l'essuyer au coton suffit-il ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 19, body: "Les deux fonctionnent. À l'eau tiède, le rinçage laisse la peau plus nette, ce qui convient bien le matin ; au coton, c'est plus doux pour les peaux très sensibles ou en cas d'eau calcaire agressive." },
    ],
  },
  {
    product_slug: 'dr-hauschka-serum-nuit', author_name: 'Pauline R.', lang: 'fr', days_ago: 17,
    body: "Le sérum est sans huile : faut-il quand même appliquer une crème par-dessus la nuit ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 16, body: "Sur peau normale à mixte, le sérum seul suffit — c'est d'ailleurs la logique de la marque, laisser la peau travailler la nuit. Sur peau sèche ou en hiver, ajoutez une crème ou un baume par-dessus, sans hésiter." },
    ],
  },
  {
    product_slug: 'borlind-ll-regeneration-creme', author_name: 'Vincent T.', lang: 'fr', days_ago: 10,
    body: "La crème est-elle vraiment végane et fabriquée en Allemagne ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 9, body: "Oui sur les deux points : Annemarie Börlind formule cette gamme sans ingrédient d'origine animale et produit sur son site de Calw, en Forêt-Noire. L'acide hyaluronique utilisé est d'origine végétale (fermentation), pas animale." },
    ],
  },
  // ---- Cheveux ----
  {
    product_slug: 'alpecin-caffeine-shampoo-c1', author_name: 'Thomas P.', lang: 'fr', days_ago: 18,
    body: "Faut-il laisser poser le shampoing quelques minutes pour que la caféine agisse ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 17, body: "Oui, le fabricant recommande de laisser agir environ 2 minutes avant de rincer, pour laisser le temps au complexe caféine d'atteindre le follicule." },
      { author_name: 'Mehdi A.', is_staff: false, lang: 'fr', days_ago: 16, body: "2 min chrono sous la douche, utilisé quotidiennement depuis 3 mois, je constate moins de chute." },
    ],
  },
  {
    product_slug: 'alpecin-caffeine-shampoo-c1', author_name: 'Manon G.', lang: 'fr', days_ago: 8,
    body: "Est-ce que ce shampoing convient aux femmes et aux cheveux colorés ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 7, body: "Oui aux deux. La communication de la marque cible les hommes, mais la formule n'a rien de spécifiquement masculin et elle ne dégrade pas la coloration. En revanche, la chute féminine a souvent des causes différentes (carence en fer, thyroïde, post-partum) : un bilan sanguin est plus utile qu'un shampoing si la chute est importante." },
    ],
  },
  {
    product_slug: 'alpecin-liquid-hair-energizer', author_name: 'Bastien R.', lang: 'fr', days_ago: 14,
    body: "Le tonique s'applique sur cheveux secs ou humides, et faut-il le faire tous les jours ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 13, body: "Sur cheveux essorés après le shampoing, ou sur cheveux secs les jours sans lavage — l'essentiel est que le produit atteigne le cuir chevelu, pas les longueurs. Une application quotidienne est prévue par le fabricant, l'action de la caféine étant estimée à 24 h." },
    ],
  },
  {
    product_slug: 'sebamed-anti-dandruff-shampoo', author_name: 'Karim B.', lang: 'fr', days_ago: 16,
    body: "Une fois les pellicules parties, faut-il continuer à l'utiliser ou revenir à un shampoing normal ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 15, body: "Passez en entretien : une à deux fois par semaine avec l'antipelliculaire, un shampoing doux le reste du temps. Les pellicules reviennent presque toujours à l'arrêt complet, car la levure Malassezia fait partie de la flore normale du cuir chevelu." },
    ],
  },
  {
    product_slug: 'eucerin-dermocapillaire-uree', author_name: 'Amina S.', lang: 'fr', days_ago: 13,
    body: "J'ai un psoriasis du cuir chevelu. Ce shampoing peut-il remplacer mon traitement ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 12, body: "Non, il ne remplace pas un traitement prescrit. L'urée à 5 % hydrate et aide à décoller les squames, ce qui en fait un bon shampoing d'accompagnement, mais le psoriasis relève d'un suivi dermatologique. Utilisez-le en complément, pas à la place." },
    ],
  },
  {
    product_slug: 'weleda-huile-cheveux-romarin', author_name: 'Yasmine H.', lang: 'fr', days_ago: 11,
    body: "Peut-on laisser l'huile poser toute la nuit ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 10, body: "Oui, avec une serviette sur l'oreiller. Une pose d'une heure donne déjà l'essentiel du bénéfice sur les longueurs ; toute la nuit convient surtout aux cheveux épais et très secs. Deux shampoings sont parfois nécessaires ensuite si vous avez la main lourde." },
      { author_name: 'Salima B.', is_staff: false, lang: 'fr', days_ago: 9, body: "Une heure me suffit largement. La nuit entière, mes racines étaient trop grasses le lendemain." },
    ],
  },
  {
    product_slug: 'schwarzkopf-gliss-ultimate-repair-masque', author_name: 'Chloé P.', lang: 'fr', days_ago: 9,
    body: "À quelle fréquence utiliser le masque sans alourdir les cheveux ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 8, body: "Une fois par semaine sur cheveux normaux à secs, deux fois si les longueurs sont très abîmées (décoloration, chaleur). Uniquement sur les longueurs et les pointes, jamais sur les racines, et un rinçage à l'eau fraîche en finition évite l'effet lourd." },
    ],
  },
  {
    product_slug: 'schwarzkopf-gliss-total-repair-shampoo', author_name: 'Elodie V.', lang: 'fr', days_ago: 6,
    body: "J'ai les cheveux fins, ce shampoing risque-t-il de les alourdir avec les silicones ?",
    answers: [],
  },
  {
    product_slug: 'sebamed-everyday-shampoo', author_name: 'Julie M.', lang: 'fr', days_ago: 12,
    body: "Peut-on l'utiliser sur des enfants de 4 et 7 ans ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 11, body: "Oui, la formule sans savon au pH 5.5 est conçue pour les lavages fréquents et convient aux enfants. Ce n'est pas un shampoing « sans larmes » spécifique bébé pour autant : évitez le contact direct avec les yeux." },
    ],
  },
  // ---- Bien-être ----
  {
    product_slug: 'doppelherz-magnesium-400', author_name: 'Camille T.', lang: 'fr', days_ago: 12,
    body: "À quel moment de la journée vaut-il mieux prendre le magnésium ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 11, body: "Le magnésium se prend indifféremment, mais beaucoup le prennent le soir car il favorise la détente musculaire. À prendre au cours d'un repas pour une meilleure tolérance digestive." },
    ],
  },
  {
    product_slug: 'doppelherz-magnesium-400', author_name: 'Léa N.', lang: 'fr', days_ago: 5,
    body: "Quelle forme de magnésium contient ce produit ? On lit que l'oxyde est mal assimilé.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 4, body: "La forme figure sur l'emballage et varie selon les références de la gamme. En pratique : l'oxyde est le moins cher et le moins bien absorbé (effet laxatif fréquent), le citrate est un bon compromis, le bisglycinate est le mieux toléré. Si vous avez le ventre sensible, orientez-vous vers un bisglycinate." },
      { author_name: 'Camille T.', is_staff: false, lang: 'fr', days_ago: 3, body: "J'ai eu le ventre dérangé la première semaine, puis plus rien en le prenant au milieu du repas." },
    ],
  },
  {
    product_slug: 'doppelherz-vitamin-d3-2000', author_name: 'Nicolas L.', lang: 'fr', days_ago: 15,
    body: "Un comprimé par jour ou tous les deux jours ? Les indications ne sont pas claires pour moi.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 14, body: "Le fabricant prévoit un comprimé tous les deux jours, ce qui revient à environ 1000 U.I. par jour, une dose d'entretien courante chez l'adulte. Au-delà, et surtout en cas de carence avérée, c'est un dosage sanguin et l'avis de votre médecin qui doivent décider — la vitamine D se stocke et un surdosage prolongé n'est pas anodin." },
    ],
  },
  {
    product_slug: 'doppelherz-vitamin-d3-2000', author_name: 'Salima B.', lang: 'fr', days_ago: 4,
    body: "Peut-on donner ce dosage à un adolescent de 14 ans en hiver ?",
    answers: [],
  },
  {
    product_slug: 'doppelherz-melatonin-spray', author_name: 'Inès F.', lang: 'fr', days_ago: 14,
    body: "Y a-t-il un risque d'accoutumance si je l'utilise plusieurs semaines d'affilée ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 13, body: "La mélatonine n'entraîne pas de dépendance physique comme les somnifères, mais elle est prévue pour un usage ponctuel (décalage horaire, réveil décalé), pas comme solution de fond. Si les troubles du sommeil durent plus de trois à quatre semaines, il faut en chercher la cause avec un médecin. Elle est par ailleurs déconseillée en cas de grossesse, d'allaitement et avant de conduire." },
      { author_name: 'Pauline R.', is_staff: false, lang: 'fr', days_ago: 12, body: "Utilisée trois soirs pour un décalage horaire, arrêt sans aucun effet rebond de mon côté." },
    ],
  },
  {
    product_slug: 'kneipp-valeriane-nuit', author_name: 'Antoine B.', lang: 'fr', days_ago: 10,
    body: "Peut-on associer les dragées à la valériane avec un spray à la mélatonine le même soir ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 9, body: "Rien ne l'interdit formellement, mais cumuler deux aides au sommeil sans avis médical n'a pas grand intérêt : elles agissent différemment (la mélatonine sur l'heure d'endormissement, la valériane sur la détente). Commencez par l'une, évaluez sur dix jours, et évitez de conduire après la prise." },
    ],
  },
  {
    product_slug: 'kneipp-huile-bain-relax', author_name: 'Nadia K.', lang: 'fr', days_ago: 13,
    body: "L'huile de bain convient-elle pendant la grossesse ou pour le bain des enfants ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 12, body: "Cette huile contient des huiles essentielles de lavande et de patchouli : par précaution, elle est déconseillée pendant le premier trimestre de grossesse et pour les jeunes enfants. Demandez l'avis de votre médecin ou de votre sage-femme, et préférez pour les enfants une huile de bain sans huiles essentielles." },
    ],
  },
  {
    product_slug: 'salus-floradix-fer', author_name: 'Julie M.', lang: 'fr', days_ago: 17,
    body: "Combien de temps se conserve le flacon après ouverture, et faut-il le mettre au frais ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 16, body: "Oui, au réfrigérateur après ouverture, et à consommer sous quatre semaines environ : le tonique contient des extraits de plantes et des jus de fruits, sans conservateur de synthèse. Bien refermer et ne pas boire directement au goulot." },
    ],
  },
  {
    product_slug: 'salus-floradix-fer', author_name: 'Fatima Z.', lang: 'fr', days_ago: 8,
    body: "Le thé du matin gêne-t-il vraiment l'absorption du fer ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 7, body: "Oui, les tanins du thé et du café réduisent nettement l'absorption du fer non héminique. Prenez le tonique à distance (une heure avant ou deux heures après), de préférence avec une source de vitamine C — elle est déjà présente dans la formule, ce qui aide. Le calcium (produits laitiers) a le même effet inhibiteur." },
      { author_name: 'Léa N.', is_staff: false, lang: 'fr', days_ago: 6, body: "J'ai décalé mon thé d'une heure après le tonique et ma ferritine est bien mieux remontée sur la cure suivante." },
    ],
  },
  {
    product_slug: 'salus-tisane-fenouil-bio', author_name: 'Nadia K.', lang: 'fr', days_ago: 7,
    body: "Peut-on en donner à un bébé de 8 mois contre les coliques ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 6, body: "C'est un usage traditionnel très répandu, mais les autorités européennes recommandent la prudence avec les préparations à base de fenouil chez l'enfant de moins de 4 ans, faute de données suffisantes. Ne donnez rien sans l'avis de votre pédiatre, qui jugera de la quantité et de la dilution." },
    ],
  },
  {
    product_slug: 'salus-tisane-nuit-paisible', author_name: 'Farid H.', lang: 'fr', days_ago: 5,
    body: "Cette tisane peut-elle interférer avec un traitement anxiolytique ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 4, body: "La valériane peut potentialiser l'effet sédatif de certains médicaments (anxiolytiques, hypnotiques, antihistaminiques). Ce n'est pas anodin : posez la question à votre médecin ou à votre pharmacien avant d'en faire une habitude quotidienne." },
    ],
  },
]

// ---- Forum communautaire : discussions + réponses ----------------------
// Les `posts` sont listés du plus ancien au plus récent (days_ago décroissant) :
// route.js en déduit `last_activity` à partir du dernier message.
export const FORUM_THREADS_SEED = [
  // ================= ROUTINES & CONSEILS =================
  {
    category: 'routine', author_name: 'Sophie L.', lang: 'fr', days_ago: 26, pinned: true,
    title: "Par quel actif commencer quand on débute ?",
    body: "Bonjour à tous ! Je débute en skincare et je suis un peu perdue avec tous les actifs. On me conseille niacinamide, d'autres rétinol... par quoi commencer sans irriter ma peau ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 25, body: "Bienvenue ! La niacinamide est un excellent premier actif : polyvalente, bien tolérée, elle régule le sébum et unifie le teint. Le rétinol s'introduit plus tard, progressivement, et toujours avec un SPF le matin." },
      { author_name: 'Amélie R.', is_staff: false, lang: 'fr', days_ago: 24, body: "+1 pour la niacinamide. J'ai commencé avec 5% et zéro irritation. Le plus important au début c'est surtout : nettoyant doux + hydratant + SPF." },
      { author_name: 'Lucas G.', is_staff: false, lang: 'fr', days_ago: 20, body: "N'oublie pas d'introduire un seul actif à la fois pour repérer ce qui te réussit (ou pas). J'ai fait l'erreur d'en lancer trois en même temps, impossible de savoir lequel me faisait rougir." },
      { author_name: 'Nadia K.', is_staff: false, lang: 'fr', days_ago: 12, body: "Et laisse au moins quatre semaines à chaque produit avant de juger. La peau se renouvelle en 28 jours environ, avant ça on ne voit presque rien." },
    ],
  },
  {
    category: 'routine', author_name: 'Théo C.', lang: 'fr', days_ago: 21, pinned: false,
    title: "Combien de temps faut-il attendre entre deux produits ?",
    body: "On lit partout qu'il faut attendre que chaque couche pénètre avant d'appliquer la suivante. Certains disent 30 secondes, d'autres 10 minutes. Qui a raison ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 20, body: "Pour la majorité des produits, il suffit d'attendre que la couche précédente ne soit plus liquide au toucher, soit environ 30 à 60 secondes. Les seules attentes vraiment utiles concernent les acides exfoliants et le rétinol, où laisser la peau sécher 10 minutes réduit l'irritation." },
      { author_name: 'Manon G.', is_staff: false, lang: 'fr', days_ago: 19, body: "Petite exception : l'acide hyaluronique gagne à être posé sur peau encore humide, sinon il assèche par temps sec." },
      { author_name: 'Théo C.', is_staff: false, lang: 'fr', days_ago: 17, body: "Merci, ça simplifie beaucoup ma routine du matin. J'attendais cinq minutes entre chaque produit, je perdais un temps fou pour rien." },
    ],
  },
  {
    category: 'routine', author_name: 'Sabrina M.', lang: 'fr', days_ago: 16, pinned: false,
    title: "Peau mixte : hydrater sans briller à midi, vous faites comment ?",
    body: "Zone T grasse, joues qui tirent. Si j'hydrate assez pour les joues, je brille à midi ; si je réduis, ça tiraille. Existe-t-il une solution qui ne soit pas deux crèmes différentes ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 15, body: "Deux textures sur deux zones (« multi-masking » appliqué à l'hydratation) restent la solution la plus simple : gel léger sur la zone T, crème sur les joues. Autre piste : un sérum hydratant sur tout le visage, et la crème riche uniquement sur les zones sèches." },
      { author_name: 'Rachid O.', is_staff: false, lang: 'fr', days_ago: 14, body: "Ce qui a changé les choses chez moi : arrêter les nettoyants décapants. Moins j'agresse, moins ma zone T surproduit du sébum en compensation." },
      { author_name: 'Sabrina M.', is_staff: false, lang: 'fr', days_ago: 13, body: "Intéressant, je vais tester le nettoyant plus doux avant de multiplier les crèmes. Merci à vous deux." },
      { author_name: 'Chloé P.', is_staff: false, lang: 'fr', days_ago: 6, body: "Un papier matifiant à midi plutôt qu'une retouche de poudre m'a aussi beaucoup aidée, ça n'assèche pas la peau." },
    ],
  },
  {
    category: 'routine', author_name: 'Hugo D.', lang: 'fr', days_ago: 12, pinned: false,
    title: "Le contour des yeux séparé, utile ou argument marketing ?",
    body: "30 euros pour 15 ml, avec souvent une composition proche de la crème visage. Est-ce que ça vaut vraiment le coup, ou ma crème hydratante suffit-elle autour des yeux ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 11, body: "La peau du contour de l'œil est plus fine et plus réactive, mais beaucoup de crèmes visage peuvent y être appliquées sans problème. Un soin dédié se justifie surtout dans deux cas : une formule visage trop riche ou trop active (rétinol, acides forts) qui irriterait la zone, et un besoin ciblé (poches, cernes) avec des actifs spécifiques comme la caféine." },
      { author_name: 'Delphine A.', is_staff: false, lang: 'fr', days_ago: 10, body: "J'ai arrêté les contours des yeux à 30 euros, j'applique ma crème habituelle en tapotant. Aucune différence après un an." },
      { author_name: 'Pauline R.', is_staff: false, lang: 'fr', days_ago: 8, body: "Moi je ne peux pas : ma crème de nuit me fait gonfler les paupières. Donc ça dépend vraiment de la formule utilisée." },
    ],
  },
  {
    category: 'routine', author_name: 'Nora T.', lang: 'fr', days_ago: 4, pinned: false,
    title: "Routine pour un ado de 14 ans : par quoi commencer sans en faire trop ?",
    body: "Mon fils commence à avoir des boutons et veut « une routine » comme il voit sur les réseaux. J'aimerais éviter qu'il achète dix produits inutiles. Quel est le minimum vraiment utile à cet âge ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 3, body: "Trois produits suffisent largement : un nettoyant doux matin et soir, un hydratant léger non comédogène, et un SPF le matin. Les actifs anti-âge n'ont aucun intérêt à cet âge. Si les boutons sont inflammatoires et nombreux, une consultation dermatologique vaut mieux que n'importe quelle routine achetée en ligne." },
      { author_name: 'Julie M.', is_staff: false, lang: 'fr', days_ago: 2, body: "Même situation ici. Ce qui a aidé mon fils : ne pas changer de produit toutes les deux semaines et ne pas percer les boutons. Le reste a suivi tout seul." },
    ],
  },
  // ================= INGRÉDIENTS & SCIENCE =================
  {
    category: 'ingredients', author_name: 'Inès F.', lang: 'fr', days_ago: 19, pinned: false,
    title: "Niacinamide et vitamine C : vraiment incompatibles ?",
    body: "J'ai lu partout qu'il ne faut pas mélanger niacinamide et vitamine C. C'est vrai ou c'est un mythe ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 18, body: "C'est un mythe tenace ! Il repose sur des études des années 1960 dans des conditions non réalistes (hautes températures). Dans les formules modernes, les deux cohabitent très bien." },
      { author_name: 'Claire D.', is_staff: false, lang: 'fr', days_ago: 15, body: "Je les utilise ensemble tous les matins depuis un an, aucun souci et le teint est plus lumineux." },
      { author_name: 'Grégoire M.', is_staff: false, lang: 'fr', days_ago: 9, body: "Si vraiment on est inquiet, il suffit de mettre la vitamine C le matin et la niacinamide le soir. Mais je n'ai jamais rien constaté en les superposant." },
    ],
  },
  {
    category: 'ingredients', author_name: 'Amina S.', lang: 'fr', days_ago: 17, pinned: false,
    title: "Mon sérum à l'acide hyaluronique dessèche ma peau, c'est possible ?",
    body: "Depuis que j'utilise un sérum à l'acide hyaluronique, ma peau tiraille davantage. C'est censé hydrater pourtant. Est-ce que je fais quelque chose de travers ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 16, body: "Ce n'est pas dans votre tête : l'acide hyaluronique est un humectant, il capte l'eau autour de lui. Dans un air très sec (chauffage, climatisation), s'il ne trouve pas d'eau dans l'environnement, il en puise dans les couches supérieures de la peau. Deux règles : l'appliquer sur peau humide, et toujours refermer avec une crème par-dessus." },
      { author_name: 'Inès F.', is_staff: false, lang: 'fr', days_ago: 15, body: "J'ai fait cette erreur pendant des mois. Depuis que je vaporise un peu d'eau thermale avant, plus aucun tiraillement." },
      { author_name: 'Amina S.', is_staff: false, lang: 'fr', days_ago: 14, body: "Testé une semaine sur peau humide avec une crème derrière : problème réglé. Merci beaucoup, je pensais être allergique au produit." },
    ],
  },
  {
    category: 'ingredients', author_name: 'Bastien R.', lang: 'fr', days_ago: 15, pinned: false,
    title: "SPF 30 ou SPF 50 : la différence justifie-t-elle le prix ?",
    body: "Un SPF 30 filtre 96,7% des UVB, un SPF 50 environ 98%. Sur le papier, l'écart est faible. Est-ce que ça change vraiment quelque chose au quotidien ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 14, body: "L'écart en pourcentage est trompeur : ce qui compte, c'est le rayonnement qui passe. 3,3% contre 2%, cela fait environ 60% d'UVB en plus qui atteignent la peau avec un SPF 30. Sur une exposition quotidienne cumulée pendant des années, ce n'est pas négligeable. Cela dit, un SPF 30 que vous appliquez généreusement tous les jours protège mieux qu'un SPF 50 que vous n'aimez pas mettre." },
      { author_name: 'Camille T.', is_staff: false, lang: 'fr', days_ago: 12, body: "Le vrai sujet est la quantité appliquée. Presque personne ne met les deux milligrammes par centimètre carré des tests en laboratoire, donc en pratique on est bien en dessous de l'indice affiché." },
      { author_name: 'Bastien R.', is_staff: false, lang: 'fr', days_ago: 11, body: "La règle des deux doigts pour le visage, c'est ça ? J'en mettais trois fois moins." },
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 10, body: "Exactement : deux lignes de produit sur l'index et le majeur pour le visage et le cou. C'est le meilleur réflexe à prendre, avant même de choisir entre 30 et 50." },
    ],
  },
  {
    category: 'ingredients', author_name: 'Yasmine H.', lang: 'fr', days_ago: 10, pinned: false,
    title: "Lire une liste INCI sans y passer une heure : vos repères ?",
    body: "Je veux apprendre à décrypter les étiquettes mais les listes font parfois quarante lignes. Sur quoi faut-il se concentrer en priorité ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 9, body: "Trois repères suffisent pour l'essentiel. Un : les ingrédients sont classés par ordre décroissant jusqu'à 1%, donc ce qui figure après le premier conservateur ou après le parfum est présent en très faible quantité. Deux : repérez la position de l'actif annoncé — s'il arrive après le parfum, la promesse marketing est douteuse. Trois : les 26 allergènes parfumants (linalool, limonene, geraniol...) sont listés en fin d'INCI, utile si votre peau est réactive." },
      { author_name: 'Léa N.', is_staff: false, lang: 'fr', days_ago: 8, body: "J'ajouterais : « Aqua » en premier est normal, ce n'est pas un défaut. J'ai longtemps cru que c'était mauvais signe." },
      { author_name: 'Yasmine H.', is_staff: false, lang: 'fr', days_ago: 7, body: "Merci, la règle du « après le parfum = moins de 1% » est très parlante. Je vais regarder mes produits autrement." },
    ],
  },
  {
    category: 'ingredients', author_name: 'Elodie V.', lang: 'fr', days_ago: 7, pinned: false,
    title: "Rétinol : combien de temps dure la phase où la peau pèle ?",
    body: "Troisième semaine de rétinol, deux soirs par semaine, et je pèle autour du nez et du menton. Est-ce que ça finit par passer ou est-ce que ma peau ne le supportera jamais ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 6, body: "La phase d'adaptation dure généralement deux à six semaines. Quelques ajustements aident beaucoup : appliquer sur peau parfaitement sèche, en couche fine, encadrer avec une crème (méthode sandwich), et espacer plutôt qu'arrêter. En revanche, si la peau brûle, rougit fortement ou reste irritée plus de six semaines, la concentration est trop élevée pour vous." },
      { author_name: 'Sabrina M.', is_staff: false, lang: 'fr', days_ago: 5, body: "Chez moi ça a duré presque trois semaines puis plus rien. Ne pas superposer d'acide exfoliant pendant cette période, c'est ce qui m'a sauvée." },
      { author_name: 'Charlotte D.', is_staff: false, lang: 'fr', days_ago: 3, body: "Et un SPF vraiment quotidien, sinon on annule tout le bénéfice et on fragilise davantage la peau." },
    ],
  },
  // ================= CHEVEUX & CUIR CHEVELU =================
  {
    category: 'hair', author_name: 'Rachid O.', lang: 'fr', days_ago: 14, pinned: false,
    title: "Shampoing à la caféine : au bout de combien de temps voit-on un effet ?",
    body: "Je viens de commencer un shampoing à la caféine contre la chute. Réaliste d'espérer un résultat, et sous combien de temps ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 13, body: "Les preuves cliniques sont de niveau modéré : la caféine agit surtout en prévention/ralentissement sur la chute héréditaire, pas comme un traitement miracle. Comptez au moins 3 à 4 mois d'usage quotidien pour juger, le cycle du cheveu étant long." },
      { author_name: 'Vincent T.', is_staff: false, lang: 'fr', days_ago: 8, body: "3 mois ici, la chute a nettement diminué. À combiner avec le tonique sans rinçage pour un effet 24h." },
      { author_name: 'Thomas P.', is_staff: false, lang: 'fr', days_ago: 5, body: "Un conseil : prenez une photo du sommet du crâne au démarrage, en lumière du jour. Sans point de comparaison, on ne se rend compte de rien au bout de quatre mois." },
    ],
  },
  {
    category: 'hair', author_name: 'Fatima Z.', lang: 'fr', days_ago: 13, pinned: false,
    title: "Chute post-partum : vos expériences, ça s'arrête quand ?",
    body: "Quatre mois après mon accouchement, je perds des poignées de cheveux au lavage. On me dit que c'est normal mais c'est difficile à vivre. Combien de temps ça a duré chez vous ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 12, body: "C'est un effluvium télogène : la grossesse prolonge la phase de croissance, et à l'accouchement tous ces cheveux repassent en phase de chute en même temps. Le pic se situe généralement entre le 3e et le 5e mois, avec un retour à la normale vers 6 à 12 mois. Un bilan ferritine et thyroïde est utile si cela dure au-delà, surtout en cas d'allaitement." },
      { author_name: 'Amina S.', is_staff: false, lang: 'fr', days_ago: 11, body: "Chez moi ça a duré jusqu'à sept mois, puis les petits cheveux ont repoussé sur le front. Ce sont les fameux « baby hairs » qu'on voit ensuite." },
      { author_name: 'Salima B.', is_staff: false, lang: 'fr', days_ago: 9, body: "Ma ferritine était à 11 après mon deuxième. Une cure de fer sur avis médical a beaucoup aidé. Faites vérifier avant de dépenser en shampoings anti-chute." },
      { author_name: 'Fatima Z.', is_staff: false, lang: 'fr', days_ago: 4, body: "Merci à toutes, ça rassure. Prise de sang prévue la semaine prochaine." },
    ],
  },
  {
    category: 'hair', author_name: 'Karim B.', lang: 'fr', days_ago: 11, pinned: false,
    title: "Pellicules qui reviennent chaque hiver : comment casser le cycle ?",
    body: "Tous les ans, dès novembre, les pellicules reviennent. Je fais un traitement, ça part, et six semaines plus tard c'est reparti. Y a-t-il un moyen de sortir de cette boucle ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 10, body: "L'erreur la plus fréquente est d'arrêter complètement l'antipelliculaire dès que les symptômes disparaissent. La levure Malassezia fait partie de la flore normale du cuir chevelu : on la régule, on ne l'élimine pas. Passez en entretien (une à deux fois par semaine) au lieu d'arrêter, et alternez si possible deux actifs différents, par exemple piroctone olamine et acide salicylique." },
      { author_name: 'Antoine B.', is_staff: false, lang: 'fr', days_ago: 8, body: "Autre chose qui a joué chez moi : l'eau trop chaude et le séchage à haute température. Cuir chevelu plus sec = plus de desquamation." },
      { author_name: 'Karim B.', is_staff: false, lang: 'fr', days_ago: 7, body: "L'entretien une fois par semaine, je n'y avais jamais pensé. Je tente cet hiver et je reviens faire un retour." },
    ],
  },
  {
    category: 'hair', author_name: 'Chloé P.', lang: 'fr', days_ago: 6, pinned: false,
    title: "Racines grasses et pointes sèches : deux problèmes, une seule routine ?",
    body: "Je dois laver tous les deux jours à cause des racines, mais mes longueurs sont sèches et cassantes. Chaque produit règle un problème et aggrave l'autre. Comment vous vous en sortez ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 5, body: "Il faut dissocier les zones : shampoing doux appliqué uniquement sur le cuir chevelu, en massant, et laisser la mousse descendre sur les longueurs au rinçage seulement. Le soin ou le masque à l'inverse s'applique de la moitié aux pointes, jamais sur les racines. Un bain d'huile avant shampoing sur les longueurs complète bien le tableau." },
      { author_name: 'Léa N.', is_staff: false, lang: 'fr', days_ago: 4, body: "Le rinçage à l'eau froide en dernier m'a aussi changé la vie sur la brillance et le côté gras des racines." },
      { author_name: 'Yasmine H.', is_staff: false, lang: 'fr', days_ago: 2, body: "Attention aussi à ne pas laver trop chaud, ça stimule les glandes sébacées. Depuis que je lave tiède, j'espace d'une journée." },
    ],
  },
  // ================= BIEN-ÊTRE & COMPLÉMENTS =================
  {
    category: 'wellness', author_name: 'Pauline R.', lang: 'fr', days_ago: 9, pinned: false,
    title: "Mélatonine vs valériane pour mieux dormir ?",
    body: "Entre la mélatonine en spray et la valériane, laquelle choisir pour des difficultés d'endormissement occasionnelles ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 8, body: "La mélatonine (1 mg) a une allégation EFSA reconnue pour réduire le temps d'endormissement — utile en cas de décalage horaire. La valériane relève d'un usage traditionnel, plutôt pour la détente. À éviter la mélatonine chez la femme enceinte." },
      { author_name: 'Claire D.', is_staff: false, lang: 'fr', days_ago: 6, body: "La mélatonine m'aide à m'endormir mais pas à rester endormie. La valériane a un effet plus diffus, moins spectaculaire mais plus régulier sur la durée." },
      { author_name: 'Marc V.', is_staff: false, lang: 'fr', days_ago: 3, body: "Avant les compléments, j'ai supprimé les écrans une heure avant le coucher. Effet plus net que tout ce que j'avais acheté avant." },
    ],
  },
  {
    category: 'wellness', author_name: 'Camille T.', lang: 'fr', days_ago: 18, pinned: false,
    title: "Magnésium : quelle forme choisir et à quel moment de la journée ?",
    body: "Oxyde, citrate, bisglycinate, malate... les prix vont du simple au quadruple. Comment choisir sans se ruiner, et faut-il le prendre matin ou soir ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 17, body: "En résumé : l'oxyde est le moins cher, très peu absorbé et souvent laxatif ; le citrate offre un bon compromis prix/tolérance ; le bisglycinate est le mieux toléré digestivement, et c'est le choix à privilégier si vous avez le ventre sensible. Le moment de la prise importe peu pour l'efficacité, mais le soir au repas convient à la plupart des gens, l'effet sur la détente musculaire étant apprécié avant la nuit." },
      { author_name: 'Marc V.', is_staff: false, lang: 'fr', days_ago: 16, body: "Le duo magnésium plus vitamine B6 est souvent recommandé pour l'assimilation. Les formules qui associent les deux ne coûtent pas plus cher." },
      { author_name: 'Sabrina M.', is_staff: false, lang: 'fr', days_ago: 14, body: "Je confirme pour l'oxyde : première cure, ventre dérangé pendant une semaine. Passée au bisglycinate, plus aucun problème." },
      { author_name: 'Camille T.', is_staff: false, lang: 'fr', days_ago: 12, body: "Parfait, merci. Je vais finir ma boîte actuelle et changer de forme pour la prochaine cure." },
    ],
  },
  {
    category: 'wellness', author_name: 'Nicolas L.', lang: 'fr', days_ago: 12, pinned: false,
    title: "Vitamine D en hiver : se supplémenter sans faire de prise de sang ?",
    body: "Mon médecin dit que presque tout le monde est carencé en hiver et qu'un dosage n'est pas toujours remboursé. Est-ce raisonnable de se supplémenter à l'aveugle ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 11, body: "Une supplémentation d'entretien de l'ordre de 800 à 1000 U.I. par jour en hiver est courante chez l'adulte et considérée comme sûre. En revanche, les protocoles à fortes doses (ampoules de 50 000 à 100 000 U.I.) ne se prennent pas à l'aveugle : la vitamine D est liposoluble et se stocke. Le dosage sanguin devient utile en cas de fatigue persistante, de douleurs osseuses ou de facteurs de risque, et c'est votre médecin qui doit trancher." },
      { author_name: 'Salima B.', is_staff: false, lang: 'fr', days_ago: 9, body: "Mon taux était à 18 ng/ml en janvier alors que je pensais aller très bien. Le dosage m'a évité de sous-doser pendant des mois." },
      { author_name: 'Théo C.', is_staff: false, lang: 'fr', days_ago: 5, body: "À prendre avec un repas contenant un peu de gras, c'est ce qui améliore le plus l'absorption d'après ce que j'ai lu." },
    ],
  },
  {
    category: 'wellness', author_name: 'Mehdi A.', lang: 'fr', days_ago: 5, pinned: false,
    title: "Compléments et jeûne : comment répartir les prises pendant le Ramadan ?",
    body: "Je prends du magnésium et de la vitamine D. Entre le ftour et le shour, comment répartir au mieux pour que ce soit efficace et bien toléré ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 4, body: "Les deux se prennent au cours d'un repas : la vitamine D est liposoluble et s'absorbe mieux avec un repas contenant des lipides, donc plutôt au ftour ; le magnésium peut aller au ftour ou au shour, avec de la nourriture pour éviter les désagréments digestifs. Point le plus important sur cette période : l'hydratation entre les deux repas, qui compte davantage que le moment exact de la prise. En cas de traitement médical, demandez l'avis de votre médecin avant d'ajuster les horaires." },
      { author_name: 'Yasmine H.', is_staff: false, lang: 'fr', days_ago: 3, body: "Magnésium au shour pour moi, ça m'évite les crampes en fin de journée. La vitamine D au ftour avec le repas principal." },
      { author_name: 'Farid H.', is_staff: false, lang: 'fr', days_ago: 2, body: "Et éviter le café juste après un complément de fer, les tanins bloquent l'absorption. Erreur que je faisais chaque année." },
    ],
  },
  // ================= MARQUES ALLEMANDES =================
  {
    category: 'brands', author_name: 'Laura S.', lang: 'fr', days_ago: 5, pinned: false,
    title: "Pourquoi les marques allemandes tiennent autant au pH 5.5 ?",
    body: "Je vois souvent 'pH 5.5' sur les produits Sebamed et Eucerin. Qu'est-ce que ça change concrètement ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 4, body: "Le pH 5.5 correspond à celui du manteau acide protecteur de la peau. Respecter ce pH préserve la barrière cutanée et le microbiome, ce qui réduit sensibilité et irritations — d'où l'attachement des marques dermatologiques allemandes à cette valeur." },
      { author_name: 'Yasmine H.', is_staff: false, lang: 'fr', days_ago: 2, body: "Depuis que je suis passée à un nettoyant pH 5.5, fini les tiraillements après le lavage !" },
    ],
  },
  {
    category: 'brands', author_name: 'Grégoire M.', lang: 'fr', days_ago: 20, pinned: false,
    title: "Weleda ou Dr. Hauschka : quelle différence réelle entre les deux ?",
    body: "Les deux marques sont bio, allemandes ou suisses, et se réclament de la même philosophie anthroposophique. Y a-t-il une vraie différence à l'usage ou est-ce affaire de goût ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 19, body: "Les deux partagent la même origine de pensée, mais diffèrent en pratique. Weleda propose une gamme plus large et plus accessible, avec des textures riches et des produits multi-usages (la Skin Food en est l'exemple). Dr. Hauschka travaille des textures plus légères, souvent sans huile pour certains soins de nuit, et défend une approche « rythmique » avec des soins matin et soir très différenciés. Le prix moyen est plus élevé chez Dr. Hauschka." },
      { author_name: 'Claire D.', is_staff: false, lang: 'fr', days_ago: 17, body: "Ma peau réactive préfère nettement Dr. Hauschka, moins riche. Mais pour les mains et le corps, Weleda est imbattable au prix." },
      { author_name: 'Pauline R.', is_staff: false, lang: 'fr', days_ago: 13, body: "À noter que les deux utilisent beaucoup d'huiles essentielles. Pour une peau qui réagit aux parfums naturels, ce n'est pas le meilleur point de départ, marque bio ou pas." },
    ],
  },
  {
    category: 'brands', author_name: 'Salima B.', lang: 'fr', days_ago: 16, pinned: false,
    title: "Eucerin, Nivea, La Prairie : c'est vraiment le même groupe ?",
    body: "On m'a dit que Nivea et Eucerin appartenaient à la même entreprise. Si c'est le cas, pourquoi une telle différence de positionnement et de prix ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 15, body: "Oui : Nivea, Eucerin et La Prairie appartiennent toutes au groupe allemand Beiersdorf, fondé à Hambourg en 1882. La différence tient au circuit de distribution et au niveau de preuve exigé : Eucerin est positionnée en pharmacie avec des études cliniques sur ses actifs brevetés (Thiamidol, Anti-Pigment), Nivea vise la grande distribution avec des formules plus simples et des volumes énormes. Le brevet Luminous630 illustre bien le passage d'une innovation du laboratoire commun vers les deux gammes." },
      { author_name: 'Nicolas L.', is_staff: false, lang: 'fr', days_ago: 14, body: "C'est exactement pour ça que le sérum Luminous630 de Nivea est intéressant : même actif breveté que des références bien plus chères." },
      { author_name: 'Salima B.', is_staff: false, lang: 'fr', days_ago: 12, body: "Merci pour la clarification, je comprends mieux la logique de gammes du groupe." },
    ],
  },
  {
    category: 'brands', author_name: 'Farid H.', lang: 'fr', days_ago: 8, pinned: false,
    title: "« Made in Germany » en cosmétique : vrai gage de qualité ou argument de vente ?",
    body: "Je vois cette mention partout sur les produits mis en avant ici. Est-ce que la fabrication allemande change réellement quelque chose, sachant que la réglementation cosmétique est européenne ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 7, body: "Vous avez raison sur un point : le règlement cosmétique 1223/2009 s'applique de la même façon dans toute l'Union, donc la sécurité de base ne dépend pas du pays. Ce que la mention traduit plutôt, c'est une tradition industrielle : forte présence de marques issues de laboratoires pharmaceutiques, habitude des tests cliniques publiés, formules souvent sobres et peu parfumées. C'est un indice de culture produit, pas une garantie réglementaire supplémentaire." },
      { author_name: 'Vincent T.', is_staff: false, lang: 'fr', days_ago: 6, body: "Réponse honnête, ça change des argumentaires habituels. Le vrai critère reste la composition et les preuves, pas le drapeau sur l'emballage." },
      { author_name: 'Delphine A.', is_staff: false, lang: 'fr', days_ago: 4, body: "Ce que j'apprécie surtout, c'est le faible taux de parfum dans les gammes dermatologiques allemandes. Pour une peau sensible, ça compte plus que l'origine." },
    ],
  },
  {
    category: 'brands', author_name: 'Nora T.', lang: 'fr', days_ago: 2, pinned: false,
    title: "Comment vérifier qu'un produit allemand acheté en ligne n'est pas une contrefaçon ?",
    body: "J'ai vu des écarts de prix énormes sur certaines places de marché pour les mêmes références. Quels sont les signaux qui doivent alerter ?",
    posts: [],
  },
]
