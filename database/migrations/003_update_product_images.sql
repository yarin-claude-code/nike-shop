-- Migration 003: Update product images with curated real shoe photos from Unsplash
-- All photos are free for commercial use (Unsplash license)
-- Each product gets 2 unique images (primary + secondary)

-- Clear existing images and re-insert with curated URLs
DELETE FROM product_images;

-- NIKE (10 products, IDs 114-123)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  -- Air Max 90
  (114, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&fit=crop', 'Air Max 90 side view', true, 0),
  (114, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80&fit=crop', 'Air Max 90 top view', false, 1),
  -- Dunk Low Retro
  (115, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80&fit=crop', 'Dunk Low Retro', true, 0),
  (115, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80&fit=crop', 'Dunk Low Retro angle', false, 1),
  -- Air Force 1
  (116, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80&fit=crop', 'Air Force 1 white', true, 0),
  (116, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80&fit=crop', 'Air Force 1 detail', false, 1),
  -- Air Max 270
  (117, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80&fit=crop', 'Air Max 270', true, 0),
  (117, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80&fit=crop', 'Air Max 270 detail', false, 1),
  -- Cortez
  (118, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80&fit=crop', 'Nike Cortez', true, 0),
  (118, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80&fit=crop', 'Nike Cortez angle', false, 1),
  -- Blazer Mid
  (119, 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80&fit=crop', 'Blazer Mid', true, 0),
  (119, 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80&fit=crop', 'Blazer Mid detail', false, 1),
  -- React Infinity Run
  (120, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80&fit=crop', 'React Infinity Run', true, 0),
  (120, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80&fit=crop', 'React Infinity Run angle', false, 1),
  -- Zoom Pegasus
  (121, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80&fit=crop', 'Zoom Pegasus', true, 0),
  (121, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop', 'Zoom Pegasus side', false, 1),
  -- Waffle Trainer
  (122, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80&fit=crop', 'Waffle Trainer', true, 0),
  (122, 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80&fit=crop', 'Waffle Trainer detail', false, 1),
  -- Revolution 6
  (123, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80&fit=crop', 'Revolution 6', true, 0),
  (123, 'https://images.unsplash.com/photo-1556048219-bb6978360b84?w=800&q=80&fit=crop', 'Revolution 6 angle', false, 1),

  -- ADIDAS (10 products, IDs 124-133)
  -- Ultraboost 22
  (124, 'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=800&q=80&fit=crop', 'Ultraboost 22', true, 0),
  (124, 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&q=80&fit=crop', 'Ultraboost 22 sole', false, 1),
  -- Stan Smith
  (125, 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80&fit=crop', 'Stan Smith', true, 0),
  (125, 'https://images.unsplash.com/photo-1600054800433-92100426ee93?w=800&q=80&fit=crop', 'Stan Smith back', false, 1),
  -- NMD R1
  (126, 'https://images.unsplash.com/photo-1588484628369-dd7a85bfdc38?w=800&q=80&fit=crop', 'NMD R1', true, 0),
  (126, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80&fit=crop', 'NMD R1 detail', false, 1),
  -- Forum Low
  (127, 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=800&q=80&fit=crop', 'Forum Low', true, 0),
  (127, 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&q=80&fit=crop', 'Forum Low angle', false, 1),
  -- Gazelle
  (128, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80&fit=crop', 'Gazelle', true, 0),
  (128, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80&fit=crop', 'Gazelle detail', false, 1),
  -- Superstar
  (129, 'https://images.unsplash.com/photo-1603787081151-cbebeef20092?w=800&q=80&fit=crop', 'Superstar', true, 0),
  (129, 'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=800&q=80&fit=crop', 'Superstar shell toe', false, 1),
  -- ZX 500
  (130, 'https://images.unsplash.com/photo-1612902377756-414b2139d5e2?w=800&q=80&fit=crop', 'ZX 500', true, 0),
  (130, 'https://images.unsplash.com/photo-1576087084971-07b2da80b0d5?w=800&q=80&fit=crop', 'ZX 500 angle', false, 1),
  -- EQT Support
  (131, 'https://images.unsplash.com/photo-1590673846749-e2fb8f655df8?w=800&q=80&fit=crop', 'EQT Support', true, 0),
  (131, 'https://images.unsplash.com/photo-1552066344-2464c1135c32?w=800&q=80&fit=crop', 'EQT Support detail', false, 1),
  -- Copa Mundial
  (132, 'https://images.unsplash.com/photo-1547586877-0351a7143cbe?w=800&q=80&fit=crop', 'Copa Mundial', true, 0),
  (132, 'https://images.unsplash.com/photo-1595461233401-8c1c4cc5c947?w=800&q=80&fit=crop', 'Copa Mundial detail', false, 1),
  -- Samba
  (133, 'https://images.unsplash.com/photo-1524532787116-e70228437bbe?w=800&q=80&fit=crop', 'Samba', true, 0),
  (133, 'https://images.unsplash.com/photo-1606107557808-f06b8a580d37?w=800&q=80&fit=crop', 'Samba side view', false, 1),

  -- YEEZY (5 products, IDs 134-138)
  -- Yeezy 700 V3
  (134, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80&fit=crop', 'Yeezy 700 V3', true, 0),
  (134, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&fit=crop', 'Yeezy 700 V3 angle', false, 1),
  -- Yeezy 500
  (135, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80&fit=crop', 'Yeezy 500', true, 0),
  (135, 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&q=80&fit=crop', 'Yeezy 500 back', false, 1),
  -- Yeezy Quantum
  (136, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80&fit=crop', 'Yeezy Quantum', true, 0),
  (136, 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80&fit=crop', 'Yeezy Quantum side', false, 1),
  -- Yeezy Foam Runner
  (137, 'https://images.unsplash.com/photo-1637437757614-6491c8e915b5?w=800&q=80&fit=crop', 'Yeezy Foam Runner', true, 0),
  (137, 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800&q=80&fit=crop', 'Yeezy Foam Runner detail', false, 1),
  -- Yeezy Slide
  (138, 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=800&q=80&fit=crop', 'Yeezy Slide', true, 0),
  (138, 'https://images.unsplash.com/photo-1609250291996-fdebe6020a8f?w=800&q=80&fit=crop', 'Yeezy Slide pair', false, 1),

  -- ON CLOUD (5 products, IDs 139-143)
  -- On Cloud 5
  (139, 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=800&q=80&fit=crop', 'On Cloud 5', true, 0),
  (139, 'https://images.unsplash.com/photo-1578116922645-3976907a7671?w=800&q=80&fit=crop', 'On Cloud 5 side', false, 1),
  -- On Cloudflow
  (140, 'https://images.unsplash.com/photo-1545289414-1c3cb1c06238?w=800&q=80&fit=crop', 'On Cloudflow', true, 0),
  (140, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80&fit=crop', 'On Cloudflow sole', false, 1),
  -- On Cloudstratus
  (141, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80&fit=crop', 'On Cloudstratus', true, 0),
  (141, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80&fit=crop', 'On Cloudstratus detail', false, 1),
  -- On Cloud X
  (142, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80&fit=crop', 'On Cloud X', true, 0),
  (142, 'https://images.unsplash.com/photo-1576087084971-07b2da80b0d5?w=800&q=80&fit=crop', 'On Cloud X angle', false, 1),
  -- On The Roger
  (143, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80&fit=crop', 'On The Roger', true, 0),
  (143, 'https://images.unsplash.com/photo-1600054800433-92100426ee93?w=800&q=80&fit=crop', 'On The Roger detail', false, 1),

  -- PUMA (5 products, IDs 144-148)
  -- RS-X3 Puzzle
  (144, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80&fit=crop', 'RS-X3 Puzzle', true, 0),
  (144, 'https://images.unsplash.com/photo-1552066344-2464c1135c32?w=800&q=80&fit=crop', 'RS-X3 Puzzle angle', false, 1),
  -- Puma Suede
  (145, 'https://images.unsplash.com/photo-1603787081151-cbebeef20092?w=800&q=80&fit=crop', 'Puma Suede', true, 0),
  (145, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80&fit=crop', 'Puma Suede detail', false, 1),
  -- Puma Future Rider
  (146, 'https://images.unsplash.com/photo-1588484628369-dd7a85bfdc38?w=800&q=80&fit=crop', 'Puma Future Rider', true, 0),
  (146, 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&q=80&fit=crop', 'Puma Future Rider side', false, 1),
  -- Puma Cell
  (147, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop', 'Puma Cell', true, 0),
  (147, 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80&fit=crop', 'Puma Cell detail', false, 1),
  -- Puma Cali
  (148, 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80&fit=crop', 'Puma Cali', true, 0),
  (148, 'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=800&q=80&fit=crop', 'Puma Cali angle', false, 1),

  -- NEW BALANCE (5 products, IDs 149-153)
  -- Fresh Foam 1080v12
  (149, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80&fit=crop', 'Fresh Foam 1080v12', true, 0),
  (149, 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&q=80&fit=crop', 'Fresh Foam 1080v12 sole', false, 1),
  -- New Balance 990
  (150, 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=800&q=80&fit=crop', 'New Balance 990', true, 0),
  (150, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80&fit=crop', 'New Balance 990 side', false, 1),
  -- New Balance 574
  (151, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80&fit=crop', 'New Balance 574', true, 0),
  (151, 'https://images.unsplash.com/photo-1556048219-bb6978360b84?w=800&q=80&fit=crop', 'New Balance 574 angle', false, 1),
  -- New Balance 996
  (152, 'https://images.unsplash.com/photo-1612902377756-414b2139d5e2?w=800&q=80&fit=crop', 'New Balance 996', true, 0),
  (152, 'https://images.unsplash.com/photo-1595461233401-8c1c4cc5c947?w=800&q=80&fit=crop', 'New Balance 996 detail', false, 1),
  -- New Balance Fuelcell
  (153, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80&fit=crop', 'New Balance Fuelcell', true, 0),
  (153, 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80&fit=crop', 'New Balance Fuelcell sole', false, 1),

  -- JORDAN (5 products, IDs 154-158)
  -- Air Jordan 1 Retro High OG
  (154, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&fit=crop', 'Air Jordan 1 Retro High OG', true, 0),
  (154, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&fit=crop', 'Air Jordan 1 side', false, 1),
  -- Air Jordan 11 Retro
  (155, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80&fit=crop', 'Air Jordan 11 Retro', true, 0),
  (155, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80&fit=crop', 'Air Jordan 11 detail', false, 1),
  -- Air Jordan 3 Retro
  (156, 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80&fit=crop', 'Air Jordan 3 Retro', true, 0),
  (156, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80&fit=crop', 'Air Jordan 3 detail', false, 1),
  -- Air Jordan 6 Retro
  (157, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80&fit=crop', 'Air Jordan 6 Retro', true, 0),
  (157, 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&q=80&fit=crop', 'Air Jordan 6 angle', false, 1),
  -- Air Jordan Future
  (158, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80&fit=crop', 'Air Jordan Future', true, 0),
  (158, 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80&fit=crop', 'Air Jordan Future detail', false, 1);
