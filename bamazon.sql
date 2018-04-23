
DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(10) unsigned NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`)
VALUES
	(13,'Purina Fancy Feast Cat Food','Pets',12.59,300),
	(14,'Purina Dog Chow','Pets',30.99,450),
	(15,'The 7 Habits of Highly Effective People','Books',24.99,140),
	(16,'Charlie and the Chocolate Factory','Books',8.99,9),
	(17,'Tufted Fainting Sofa','Furniture',650.99,5),
	(18,'Quartz Stainless Steel Watch','Accessories',165.75,125),
	(19,'Sterling Silver Braided Ring','Accessories',13.99,225),
	(20,'LG Electronics 55-Inch LED TV','Electronics',600.99,195),
	(21,'Texas Instruments Scientific Calculator','Electronics',25.75,299),
	(22,'Pop-Tarts Frosted Toaster Pastries Variety Pack','Grocery',10.99,500),
	(23,'Diet Pepsi Cans - 12 Count','Grocery',4.75,1000),
	(24,'Cheerios Breakfast Cereal','Grocery',3.59,600);
