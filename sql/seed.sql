-- =============================================================================
-- Lordaeron Website — Seed Data (DML)
-- =============================================================================

-- ── 1. Admin account ─────────────────────────────────────────────────────────
-- Database: lordaeron_website

INSERT INTO shop_admins (username, password_hash, display_name, role) VALUES
('admin', '$2b$10$8RFJh7tJWezJ4hTVh9dW/e.cqmH574YwON9oHuVJGeM8/o2FIskl6', 'Administrator', 'super_admin');

-- ── 2. SOAP account for website shop delivery ────────────────────────────────
-- Database: auth
-- Generated via: pnpm exec tsx sql/generators/generate-soap-account.ts

INSERT INTO `account` (`username`, `salt`, `verifier`, `email`, `expansion`)
VALUES ('SOAPWEBSITE', X'2ec210a925754113fb1a24c3b24e00948dea3786de5720181d736af7a4aaaeff', X'971318e1a6b29dd40a73d6cf80d65de0ca8a62ba0a7f052e29d10c28224bb64a', 'soap@lordaeron.local', 2);

INSERT INTO `account_access` (`AccountID`, `SecurityLevel`, `RealmID`, `Comment`)
VALUES ((SELECT `id` FROM `account` WHERE `username` = 'SOAPWEBSITE'), 3, -1, 'Website SOAP delivery');

-- ── 3. Transmog sets — Name translations (FR, ES, DE, IT) ───────────────────
-- Database: lordaeron_website

UPDATE shop_sets SET
  name_fr = 'Armure du Jugement (Recoloré)',
  name_es = 'Armadura de Sentencia (Recolor)',
  name_de = 'Richturteilsrüstung (Umfärbung)',
  name_it = 'Armatura del Giudizio (Ricolorato)'
WHERE id = 1;

UPDATE shop_sets SET
  name_fr = 'Armure de Plaques du Gladiateur',
  name_es = 'Armadura de Placas de Gladiador',
  name_de = 'Plattenrüstung des Gladiators',
  name_it = 'Armatura a Piastre del Gladiatore'
WHERE id = 2;

UPDATE shop_sets SET
  name_fr = 'Armure Croc-de-sang (Recoloré)',
  name_es = 'Armadura Colmillo Sangriento (Recolor)',
  name_de = 'Blutfangrüstung (Umfärbung)',
  name_it = 'Armatura Zannasanguinaria (Ricolorato)'
WHERE id = 3;

UPDATE shop_sets SET
  name_fr = 'Grande tenue d''Absolution (Recoloré)',
  name_es = 'Galas de Absolución (Recolor)',
  name_de = 'Gewandung der Absolution (Umfärbung)',
  name_it = 'Paramenti dell''Assoluzione (Ricolorato)'
WHERE id = 4;

UPDATE shop_sets SET
  name_fr = 'Grande tenue Tisse-mage',
  name_es = 'Galas de Tejido de Mago',
  name_de = 'Magiestoffgewandung',
  name_it = 'Paramenti in Tessuto Magico'
WHERE id = 5;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat du Conquérant',
  name_es = 'Equipo de Batalla del Conquistador',
  name_de = 'Kampfausrüstung des Eroberers',
  name_it = 'Tenuta da Battaglia del Conquistatore'
WHERE id = 6;

UPDATE shop_sets SET
  name_fr = 'Armure de Mailles du Gladiateur',
  name_es = 'Armadura de Malla de Gladiador',
  name_de = 'Kettenrüstung des Gladiators',
  name_it = 'Armatura a Maglia del Gladiatore'
WHERE id = 7;

UPDATE shop_sets SET
  name_fr = 'Mailles du Dragon Noir',
  name_es = 'Malla del Dragón Negro',
  name_de = 'Schwarzdrachenpost',
  name_it = 'Maglia del Drago Nero'
WHERE id = 8;

UPDATE shop_sets SET
  name_fr = 'Gardien Mortos (Recoloré)',
  name_es = 'Guardián Huesamuerte (Recolor)',
  name_de = 'Todesgebeinwächter (Umfärbung)',
  name_it = 'Guardiano d''Ossamorte (Ricolorato)'
WHERE id = 9;

UPDATE shop_sets SET
  name_fr = 'Accoutrement Amani',
  name_es = 'Vestimenta Amani',
  name_de = 'Amanikleidung',
  name_it = 'Tenuta Amani'
WHERE id = 10;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat bénie de Tueur de morts-vivants',
  name_es = 'Equipo de Batalla Bendito contra No-muertos',
  name_de = 'Gesegnete Kampfausrüstung der Untotentötung',
  name_it = 'Tenuta da Battaglia Benedetta contro i Non-morti'
WHERE id = 11;

UPDATE shop_sets SET
  name_fr = 'Tenue du Cataclysme (Recoloré)',
  name_es = 'Vestiduras del Cataclismo (Recolor)',
  name_de = 'Gewandung des Kataklysmus (Umfärbung)',
  name_it = 'Vesti del Cataclisma (Ricolorato)'
WHERE id = 12;

UPDATE shop_sets SET
  name_fr = 'Tenue du Corrupteur',
  name_es = 'Vestiduras del Corruptor',
  name_de = 'Gewandung des Verderbers',
  name_it = 'Vesti del Corruttore'
WHERE id = 13;

UPDATE shop_sets SET
  name_fr = 'Étreinte du Dispensateur de mort',
  name_es = 'Abrazo del Distribuidor de Muerte',
  name_de = 'Umarmung des Todesbringers',
  name_it = 'Abbraccio del Dispensatore di Morte'
WHERE id = 14;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat du Dreadnaught',
  name_es = 'Equipo de Batalla del Acorazado',
  name_de = 'Kampfausrüstung des Schlachtschiffs',
  name_it = 'Tenuta da Battaglia del Terrore'
WHERE id = 15;

UPDATE shop_sets SET
  name_fr = 'Grande tenue de Givre-feu',
  name_es = 'Galas de Fuego Gélido',
  name_de = 'Frostfeuergewandung',
  name_it = 'Paramenti del Fuoco Gelido'
WHERE id = 16;

UPDATE shop_sets SET
  name_fr = 'Tenue Maléfique',
  name_es = 'Vestiduras Maléficas',
  name_de = 'Unheilvolle Gewandung',
  name_it = 'Vesti Malefiche'
WHERE id = 17;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat du Tueur du Puits de soleil',
  name_es = 'Equipo de Batalla del Asesino del Pozo de Sol',
  name_de = 'Kampfausrüstung des Bezwingers des Sonnenbrunnens',
  name_it = 'Tenuta da Battaglia dell''Uccisore del Pozzo Solare'
WHERE id = 18;

UPDATE shop_sets SET
  name_fr = 'Habits d''Absolution du Puits de soleil',
  name_es = 'Vestimentas de Absolución del Pozo de Sol',
  name_de = 'Sonnenbrunnengewänder der Absolution',
  name_it = 'Paramenti d''Assoluzione del Pozzo Solare'
WHERE id = 19;

UPDATE shop_sets SET
  name_fr = 'Accoutrement Tempête du Puits de soleil',
  name_es = 'Vestimenta Tempestad del Pozo de Sol',
  name_de = 'Sturm-Sonnenbrunnenkleidung',
  name_it = 'Tenuta Tempesta del Pozzo Solare'
WHERE id = 20;

UPDATE shop_sets SET
  name_fr = 'Armure d''Assassinat',
  name_es = 'Armadura de Asesinato',
  name_de = 'Meuchelmörderrüstung',
  name_it = 'Armatura dell''Assassinio'
WHERE id = 21;

UPDATE shop_sets SET
  name_fr = 'Grande tenue du Vent du Néant (Recoloré)',
  name_es = 'Galas del Viento Abisal (Recolor)',
  name_de = 'Nethersturmgewandung (Umfärbung)',
  name_it = 'Paramenti del Vento Fatuo (Ricolorato)'
WHERE id = 22;

UPDATE shop_sets SET
  name_fr = 'Mailles Amani (Recoloré)',
  name_es = 'Malla Amani (Recolor)',
  name_de = 'Amanipost (Umfärbung)',
  name_it = 'Maglia Amani (Ricolorato)'
WHERE id = 23;

UPDATE shop_sets SET
  name_fr = 'Plaques Amani',
  name_es = 'Placas Amani',
  name_de = 'Amaniplatten',
  name_it = 'Piastre Amani'
WHERE id = 24;

UPDATE shop_sets SET
  name_fr = 'Tenue Amani',
  name_es = 'Vestiduras Amani',
  name_de = 'Amanigewandung',
  name_it = 'Vesti Amani'
WHERE id = 25;

UPDATE shop_sets SET
  name_fr = 'Tenue de l''Avatar',
  name_es = 'Vestiduras del Avatar',
  name_de = 'Avatargewandung',
  name_it = 'Vesti dell''Avatar'
WHERE id = 26;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat de Puissance',
  name_es = 'Equipo de Batalla de Poder',
  name_de = 'Kampfausrüstung der Macht',
  name_it = 'Tenuta da Battaglia della Potenza'
WHERE id = 27;

UPDATE shop_sets SET
  name_fr = 'Chape de la Mort',
  name_es = 'Manto de Muerte',
  name_de = 'Todesmantel',
  name_it = 'Manto Mortale'
WHERE id = 28;

UPDATE shop_sets SET
  name_fr = 'Armure du Destructeur (Recoloré)',
  name_es = 'Armadura del Destructor (Recolor)',
  name_de = 'Verwüsterrüstung (Umfärbung)',
  name_it = 'Armatura del Distruttore (Ricolorato)'
WHERE id = 29;

UPDATE shop_sets SET
  name_fr = 'Traque du Maréchal',
  name_es = 'Persecución del Mariscal de Campo',
  name_de = 'Verfolgung des Feldmarschalls',
  name_it = 'Caccia del Maresciallo'
WHERE id = 30;

UPDATE shop_sets SET
  name_fr = 'Armure d''Écailles du Gladiateur',
  name_es = 'Armadura de Escamas de Gladiador',
  name_de = 'Schuppenrüstung des Gladiators',
  name_it = 'Armatura a Scaglie del Gladiatore'
WHERE id = 31;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat du Porteur de lumière',
  name_es = 'Equipo de Batalla del Portador de Luz',
  name_de = 'Kampfausrüstung des Lichtbringers',
  name_it = 'Tenuta da Battaglia del Portatore di Luce'
WHERE id = 32;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat du Porteur de lumière du Puits de soleil',
  name_es = 'Equipo de Batalla del Portador de Luz del Pozo de Sol',
  name_de = 'Lichtbringer-Sonnenbrunnenkampfausrüstung',
  name_it = 'Tenuta da Battaglia del Portatore di Luce del Pozzo Solare'
WHERE id = 33;

UPDATE shop_sets SET
  name_fr = 'Lame du Néant',
  name_es = 'Hoja Abisal',
  name_de = 'Netherklinge',
  name_it = 'Lama Fatua'
WHERE id = 34;

UPDATE shop_sets SET
  name_fr = 'Armure d''Assaut',
  name_es = 'Armadura de Embestida',
  name_de = 'Ansturmsrüstung',
  name_it = 'Armatura dell''Assalto'
WHERE id = 35;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat d''Assaut du Puits de soleil',
  name_es = 'Equipo de Batalla de Embestida del Pozo de Sol',
  name_de = 'Ansturm-Sonnenbrunnenkampfausrüstung',
  name_it = 'Tenuta da Battaglia dell''Assalto del Pozzo Solare'
WHERE id = 36;

UPDATE shop_sets SET
  name_fr = 'Grande tenue Cœur-de-tonnerre du Puits de soleil',
  name_es = 'Galas Corazón de Trueno del Pozo de Sol',
  name_de = 'Donnerherz-Sonnenbrunnengewandung',
  name_it = 'Paramenti Cuore di Tuono del Pozzo Solare'
WHERE id = 37;

UPDATE shop_sets SET
  name_fr = 'Habits du Vertueux',
  name_es = 'Vestimentas del Virtuoso',
  name_de = 'Gewänder des Tugendhaften',
  name_it = 'Paramenti del Virtuoso'
WHERE id = 38;

UPDATE shop_sets SET
  name_fr = 'Tenue Cœur du Vide',
  name_es = 'Vestiduras Corazón del Vacío',
  name_de = 'Leerenherzgewandung',
  name_it = 'Vesti del Cuore del Vuoto'
WHERE id = 39;

UPDATE shop_sets SET
  name_fr = 'Habits du Seigneur de guerre',
  name_es = 'Vestimentas del Señor de la Guerra',
  name_de = 'Gewänder des Kriegsfürsten',
  name_it = 'Paramenti del Signore della Guerra'
WHERE id = 40;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat de Puissance (Recoloré)',
  name_es = 'Equipo de Batalla de Poder (Recolor)',
  name_de = 'Kampfausrüstung der Macht (Umfärbung)',
  name_it = 'Tenuta da Battaglia della Potenza (Ricolorato)'
WHERE id = 41;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat du Courroux (Recoloré)',
  name_es = 'Equipo de Batalla de la Ira (Recolor)',
  name_de = 'Kampfausrüstung des Zorns (Umfärbung)',
  name_it = 'Tenuta da Battaglia dell''Ira (Ricolorato)'
WHERE id = 42;

UPDATE shop_sets SET
  name_fr = 'Armure du Traqueur de bêtes (Recoloré)',
  name_es = 'Armadura del Acechador de Bestias (Recolor)',
  name_de = 'Bestienhetzerrüstung (Umfärbung)',
  name_it = 'Armatura del Cacciatore di Bestie (Ricolorato)'
WHERE id = 43;

UPDATE shop_sets SET
  name_fr = 'Gardien Mortos (Recoloré)',
  name_es = 'Guardián Huesamuerte (Recolor)',
  name_de = 'Todesgebeinwächter (Umfärbung)',
  name_it = 'Guardiano d''Ossamorte (Ricolorato)'
WHERE id = 44;

UPDATE shop_sets SET
  name_fr = 'Plaques Exaltées (Recoloré)',
  name_es = 'Placas Exaltadas (Recolor)',
  name_de = 'Erhabene Platten (Umfärbung)',
  name_it = 'Piastre Esaltate (Ricolorato)'
WHERE id = 45;

UPDATE shop_sets SET
  name_fr = 'Armure du Justicier (Recoloré)',
  name_es = 'Armadura del Legislador (Recolor)',
  name_de = 'Gesetzeshüterrüstung (Umfärbung)',
  name_it = 'Armatura del Giustiziere (Ricolorato)'
WHERE id = 46;

UPDATE shop_sets SET
  name_fr = 'Armure Forge-lumière (Recoloré)',
  name_es = 'Armadura Forja de Luz (Recolor)',
  name_de = 'Lichtschmiedrüstung (Umfärbung)',
  name_it = 'Armatura Forgia di Luce (Ricolorato)'
WHERE id = 47;

UPDATE shop_sets SET
  name_fr = 'Grande tenue Tisse-mage (Recoloré)',
  name_es = 'Galas de Tejido de Mago (Recolor)',
  name_de = 'Magiestoffgewandung (Umfärbung)',
  name_it = 'Paramenti in Tessuto Magico (Ricolorato)'
WHERE id = 48;

UPDATE shop_sets SET
  name_fr = 'Grande tenue Gravée de mana',
  name_es = 'Galas Grabadas con Maná',
  name_de = 'Manageätzte Gewandung',
  name_it = 'Paramenti Incisi dal Mana'
WHERE id = 49;

UPDATE shop_sets SET
  name_fr = 'Armure du Tueur de la nuit (Recoloré)',
  name_es = 'Armadura del Asesino Nocturno (Recolor)',
  name_de = 'Nachtmörderrüstung (Umfärbung)',
  name_it = 'Armatura dell''Uccisore Notturno (Ricolorato)'
WHERE id = 50;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat de Mailles du Traqueur',
  name_es = 'Equipo de Batalla de Malla del Acechador',
  name_de = 'Kettenkampfausrüstung des Pirschers',
  name_it = 'Tenuta da Battaglia a Maglia del Predatore'
WHERE id = 51;

UPDATE shop_sets SET
  name_fr = 'Grande tenue d''Absolution',
  name_es = 'Galas de Absolución',
  name_de = 'Gewandung der Absolution',
  name_it = 'Paramenti dell''Assoluzione'
WHERE id = 52;

UPDATE shop_sets SET
  name_fr = 'Grande tenue de l''Arcaniste',
  name_es = 'Galas del Arcanista',
  name_de = 'Arkanistengewandung',
  name_it = 'Paramenti dell''Arcanista'
WHERE id = 53;

UPDATE shop_sets SET
  name_fr = 'Armure Croc-de-sang (Recoloré)',
  name_es = 'Armadura Colmillo Sangriento (Recolor)',
  name_de = 'Blutfangrüstung (Umfärbung)',
  name_it = 'Armatura Zannasanguinaria (Ricolorato)'
WHERE id = 54;

UPDATE shop_sets SET
  name_fr = 'Armure en Gangretisse du Gladiateur brutal',
  name_es = 'Armadura de Tejido Vil del Gladiador Brutal',
  name_de = 'Teufelsgeweberüstung des brutalen Gladiators',
  name_it = 'Armatura in Tessuto Vile del Gladiatore Brutale'
WHERE id = 55;

UPDATE shop_sets SET
  name_fr = 'Armure Forge-cristal',
  name_es = 'Armadura Forja de Cristal',
  name_de = 'Kristallschmiedrüstung',
  name_it = 'Armatura Forgia di Cristallo'
WHERE id = 56;

UPDATE shop_sets SET
  name_fr = 'Armure du Destructeur',
  name_es = 'Armadura del Destructor',
  name_de = 'Verwüsterrüstung',
  name_it = 'Armatura del Distruttore'
WHERE id = 57;

UPDATE shop_sets SET
  name_fr = 'Tenue de l''Invocateur de malheur',
  name_es = 'Atuendo del Pregonero de la Perdición',
  name_de = 'Kleidung des Verdammungsrufers',
  name_it = 'Tenuta dell''Araldo della Rovina'
WHERE id = 58;

UPDATE shop_sets SET
  name_fr = 'Armure en Anneaux du Gladiateur',
  name_es = 'Armadura de Anillas de Gladiador',
  name_de = 'Ringrüstung des Gladiators',
  name_it = 'Armatura ad Anelli del Gladiatore'
WHERE id = 59;

UPDATE shop_sets SET
  name_fr = 'Tenue de combat du Traqueur de gronns du Puits de soleil',
  name_es = 'Equipo de Batalla del Acechador de Gronns del Pozo de Sol',
  name_de = 'Gronnjäger-Sonnenbrunnenkampfausrüstung',
  name_it = 'Tenuta da Battaglia del Cacciatore di Gronn del Pozzo Solare'
WHERE id = 60;

UPDATE shop_sets SET
  name_fr = 'Grande tenue Maléfique du Puits de soleil',
  name_es = 'Galas Maléficas del Pozo de Sol',
  name_de = 'Unheilvolle Sonnenbrunnengewandung',
  name_it = 'Paramenti Malefici del Pozzo Solare'
WHERE id = 61;

UPDATE shop_sets SET
  name_fr = 'Armure en Anneaux du Gladiateur impitoyable',
  name_es = 'Armadura de Anillas del Gladiador Despiadado',
  name_de = 'Ringrüstung des erbarmungslosen Gladiators',
  name_it = 'Armatura ad Anelli del Gladiatore Spietato'
WHERE id = 62;

UPDATE shop_sets SET
  name_fr = 'Armure du Tueur de la nuit (Recoloré)',
  name_es = 'Armadura del Asesino Nocturno (Recolor)',
  name_de = 'Nachtmörderrüstung (Umfärbung)',
  name_it = 'Armatura dell''Uccisore Notturno (Ricolorato)'
WHERE id = 63;

UPDATE shop_sets SET
  name_fr = 'Tenue de Nordrassil',
  name_es = 'Vestiduras de Nordrassil',
  name_de = 'Nordrassilgewandung',
  name_it = 'Vesti di Nordrassil'
WHERE id = 64;

UPDATE shop_sets SET
  name_fr = 'Armure en Gangretisse du Gladiateur vengeur',
  name_es = 'Armadura de Tejido Vil del Gladiador Vengativo',
  name_de = 'Teufelsgeweberüstung des rachsüchtigen Gladiators',
  name_it = 'Armatura in Tessuto Vile del Gladiatore Vendicativo'
WHERE id = 65;

UPDATE shop_sets SET
  name_fr = 'Armure de Soie du Gladiateur vengeur',
  name_es = 'Armadura de Seda del Gladiador Vengativo',
  name_de = 'Seidenrüstung des rachsüchtigen Gladiators',
  name_it = 'Armatura di Seta del Gladiatore Vendicativo'
WHERE id = 66;

UPDATE shop_sets SET
  name_fr = 'Égide du Seigneur de guerre',
  name_es = 'Égida del Señor de la Guerra',
  name_de = 'Ägide des Kriegsfürsten',
  name_it = 'Egida del Signore della Guerra'
WHERE id = 67;

UPDATE shop_sets SET
  name_fr = 'Grande tenue de l''Aurore (Recoloré)',
  name_es = 'Galas de la Aurora (Recolor)',
  name_de = 'Auroragewandung (Umfärbung)',
  name_it = 'Paramenti dell''Aurora (Ricolorato)'
WHERE id = 68;

UPDATE shop_sets SET
  name_fr = 'Armure du Traqueur de dragons (Recoloré)',
  name_es = 'Armadura del Acechador de Dragones (Recolor)',
  name_de = 'Drachenpirscherrüstung (Umfärbung)',
  name_it = 'Armatura del Cacciatore di Draghi (Ricolorato)'
WHERE id = 69;

UPDATE shop_sets SET
  name_fr = 'Peau Gangrenée',
  name_es = 'Piel Vil',
  name_de = 'Teufelshaut',
  name_it = 'Pelle Vile'
WHERE id = 70;

UPDATE shop_sets SET
  name_fr = 'Grande tenue Gossamer (Recoloré)',
  name_es = 'Galas de Gasa (Recolor)',
  name_de = 'Gespinstgewandung (Umfärbung)',
  name_it = 'Paramenti di Garza (Ricolorato)'
WHERE id = 71;

UPDATE shop_sets SET
  name_fr = 'Tenue Furie-des-tempêtes (Recoloré)',
  name_es = 'Vestiduras Furia de la Tormenta (Recolor)',
  name_de = 'Sturmgrimm-Gewandung (Umfärbung)',
  name_it = 'Vesti dell''Ira della Tempesta (Ricolorato)'
WHERE id = 72;

UPDATE shop_sets SET
  name_fr = 'Habits du Dévot (Recoloré)',
  name_es = 'Vestimentas del Devoto (Recolor)',
  name_de = 'Gewänder des Frommen (Umfärbung)',
  name_it = 'Paramenti del Devoto (Ricolorato)'
WHERE id = 73;

UPDATE shop_sets SET
  name_fr = 'Séisme du Seigneur de guerre',
  name_es = 'Sacudetierras del Señor de la Guerra',
  name_de = 'Erdbeber des Kriegsfürsten',
  name_it = 'Scuotiterra del Signore della Guerra'
WHERE id = 74;

UPDATE shop_sets SET
  name_fr = 'Tenue Cœur-sauvage (Recoloré)',
  name_es = 'Vestiduras Corazón Salvaje (Recolor)',
  name_de = 'Wildherzgewandung (Umfärbung)',
  name_it = 'Vesti del Cuore Selvaggio (Ricolorato)'
WHERE id = 75;
