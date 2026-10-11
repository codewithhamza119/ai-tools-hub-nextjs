-- AI Tools HuB — add 6 missing products + fix 3 (2026-10-12)
-- Paste this whole file into the Turso dashboard SQL editor and run it.
-- Safe to run once. Uses INSERT OR IGNORE so re-running won't duplicate.

INSERT OR IGNORE INTO products
(id, name, category, duration, price, regular_price, warranty_value, warranty_unit, no_warranty_note, image, art_from, art_to, art_glyph, features, activation, note, stock, out_of_stock, sort_order, updated_at)
VALUES
('canva-pro-3m','Canva Pro','design','3 Months',299,399,1,'months',NULL,NULL,'#0d7ff2','#7c3aed','Ca',
'["Three months of Pro access for design projects.","All Canva Pro templates, elements & Brand Kit.","Background remover and Magic Studio tools."]',
'["Add the plan to your cart and send the exact total by Easypaisa or Binance.","Share the successful payment screenshot on WhatsApp.","Receive plan-specific access or activation instructions.","Follow the supplied setup steps and confirm that access is working."]',
NULL,NULL,0,16,'2026-10-12T02:30:00+05:00'),

('canva-pro-6m','Canva Pro','design','6 Months',399,599,3,'months',NULL,NULL,'#0d7ff2','#7c3aed','Ca',
'["Six months of Pro access for design projects.","All Canva Pro templates, elements & Brand Kit.","Background remover and Magic Studio tools."]',
'["Add the plan to your cart and send the exact total by Easypaisa or Binance.","Share the successful payment screenshot on WhatsApp.","Receive plan-specific access or activation instructions.","Follow the supplied setup steps and confirm that access is working."]',
NULL,NULL,0,17,'2026-10-12T02:30:00+05:00'),

('canva-pro-1y','Canva Pro','design','1 Year',699,1000,1,'years',NULL,NULL,'#0d7ff2','#7c3aed','Ca',
'["One year of Pro access for design projects.","All Canva Pro templates, elements & Brand Kit.","Background remover and Magic Studio tools."]',
'["Add the plan to your cart and send the exact total by Easypaisa or Binance.","Share the successful payment screenshot on WhatsApp.","Receive plan-specific access or activation instructions.","Follow the supplied setup steps and confirm that access is working."]',
NULL,NULL,0,18,'2026-10-12T02:30:00+05:00'),

('canva-pro-18m','Canva Pro','design','1.5 Years',999,1500,12,'months',NULL,NULL,'#0d7ff2','#7c3aed','Ca',
'["Eighteen months of Pro access for design projects.","All Canva Pro templates, elements & Brand Kit.","Background remover and Magic Studio tools."]',
'["Add the plan to your cart and send the exact total by Easypaisa or Binance.","Share the successful payment screenshot on WhatsApp.","Receive plan-specific access or activation instructions.","Follow the supplied setup steps and confirm that access is working."]',
NULL,NULL,0,19,'2026-10-12T02:30:00+05:00'),

('tiktok-uk','TikTok UK Account','creator','Account Access',799,1500,NULL,NULL,NULL,NULL,'#0f0f0f','#3b0764','Tk',
'["Fresh UK-region account setup with login guidance and usage instructions.","TikTok LIVE access for eligible accounts.","UK-region Shop features where available.","Full posting, messaging and growth features."]',
'["Add the plan to your cart and send the exact total by Easypaisa or Binance.","Share the successful payment screenshot on WhatsApp.","Share a Gmail for setup or request one from support.","Receive the account login and setup guidance on WhatsApp."]',
'Always use the TikTok account with a UK IP or a UK-based VPN. Logging in from a non-UK IP can reset your region and permanently disable UK features.',
NULL,0,40,'2026-10-12T02:30:00+05:00'),

('nordvpn-3m','Nord VPN','social','3 Months',1499,1800,3,'months',NULL,NULL,'#1d4ed8','#0ea5e9','Nv',
'["Three months of VPN access.","Premium NordVPN access.","High-speed servers worldwide.","Strict no-logs policy.","Works on all your devices."]',
'["Add the plan to your cart and send the exact total by Easypaisa or Binance.","Share the successful payment screenshot on WhatsApp.","We provide the login credentials.","Sign in to the NordVPN app, connect and browse securely."]',
NULL,50,0,33,'2026-10-12T02:30:00+05:00');

-- Corrections to existing products (match the static site)
UPDATE products SET price=3999, warranty_value=90, warranty_unit='days',
  updated_at='2026-10-12T02:30:00+05:00' WHERE id='capcut-6m';

UPDATE products SET name='Figma Pro Edu', price=2999,
  no_warranty_note='No Replacement Warranty.',
  features='["Figma Education plan access.","Monthly credit allowance included.","Full 2-year duration.","All professional design features unlocked."]',
  updated_at='2026-10-12T02:30:00+05:00' WHERE id='figma';

UPDATE products SET name='Udemy Personal Plan',
  updated_at='2026-10-12T02:30:00+05:00' WHERE id='udemy';
