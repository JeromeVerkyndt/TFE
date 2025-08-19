-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 19 août 2025 à 03:47
-- Version du serveur : 8.4.3
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tfe_panier`
--

-- --------------------------------------------------------

--
-- Structure de la table `news`
--

CREATE TABLE `news` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `text` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `news`
--

INSERT INTO `news` (`id`, `title`, `date`, `text`, `created_at`, `deleted_at`, `deleted`) VALUES
(21, 'News de la semaine de Vacance', '2025-08-18 14:06:52', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.', '2025-08-18 14:06:52', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `news_image`
--

CREATE TABLE `news_image` (
  `id` int NOT NULL,
  `news_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `news_image`
--

INSERT INTO `news_image` (`id`, `news_id`, `image_url`) VALUES
(32, 21, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518804/produits/c0zocenr63ieagi2pi6n.png'),
(33, 21, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518806/produits/zyqlizmneqvjgorrwdcr.png'),
(34, 21, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518807/produits/xuhf5i0rkz5gj0vgc9yj.png'),
(35, 21, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518809/produits/dw1eltqj34gqs5hqaptd.png'),
(36, 21, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518810/produits/oajjlmx8ph4dsnisgvni.png');

-- --------------------------------------------------------

--
-- Structure de la table `order`
--

CREATE TABLE `order` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `order_item`
--

CREATE TABLE `order_item` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `promo` float DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `included_in_subscription` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `product`
--

CREATE TABLE `product` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `unit` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `included_in_subscription` tinyint(1) DEFAULT '0',
  `image_url` text COLLATE utf8mb4_general_ci,
  `promo` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `unit`, `price`, `included_in_subscription`, `image_url`, `promo`, `created_at`, `deleted_at`, `deleted`) VALUES
(11, 'Poire', 'description test', 'kg', 5.00, 1, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518576/produits/hcdszutfxtnbmurcetp8.png', NULL, '2025-08-18 14:02:57', NULL, 0),
(12, 'Tomate', 'description tomate', 'kg', 4.50, 1, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518618/produits/uwortl0wkhkfniq8z7b5.png', NULL, '2025-08-18 14:03:39', NULL, 0),
(13, 'Carotte', 'Description carotte', 'kg', 6.00, 0, 'https://res.cloudinary.com/db7gzoduv/image/upload/v1755518660/produits/yc9r7evaiwen8zqexd7z.png', NULL, '2025-08-18 14:04:21', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `stock`
--

CREATE TABLE `stock` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `promo` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stock`
--

INSERT INTO `stock` (`id`, `product_id`, `quantity`, `promo`, `created_at`, `deleted_at`, `deleted`) VALUES
(12, 11, 100.00, 0, '2025-08-18 14:04:44', NULL, 0),
(13, 12, 150.00, 10, '2025-08-18 14:05:04', NULL, 0),
(14, 13, 230.00, 0, '2025-08-18 14:05:30', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `subscription`
--

CREATE TABLE `subscription` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `visible` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `subscription`
--

INSERT INTO `subscription` (`id`, `name`, `description`, `price`, `created_at`, `deleted_at`, `deleted`, `visible`) VALUES
(9, 'Petit', 'Description petite', 25.00, '2025-08-18 14:11:08', NULL, 0, 1),
(10, 'Moyen', 'Description moyen', 50.00, '2025-08-18 14:11:27', NULL, 0, 0),
(11, 'Grand', 'Description grand', 75.00, '2025-08-18 14:11:45', NULL, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `transaction`
--

CREATE TABLE `transaction` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `transaction`
--

INSERT INTO `transaction` (`id`, `user_id`, `amount`, `type`, `comment`, `created_at`, `deleted`, `deleted_at`, `order_id`, `is_paid`) VALUES
(54, 20, -15.00, 'Payment extra', '', '2025-08-19 03:35:03', 0, NULL, NULL, NULL),
(55, 15, 7.20, 'Payment extra', '', '2025-08-19 03:39:45', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `subscription_id` int DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `extra_balance` decimal(10,2) DEFAULT '0.00',
  `status_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `password`, `subscription_id`, `balance`, `extra_balance`, `status_id`, `created_at`, `deleted_at`, `deleted`) VALUES
(5, 'Jérôme', 'Verkyndt', 'jerome.verkyndt@gmail.com', '$2b$10$OUWWqbMxXCczMKgAUBt5hOJB2YVl/obJJbIqbdHjYJotV6.cuEbTa', NULL, 0.00, 0.00, 1, '2025-05-23 01:59:42', NULL, 0),
(8, 'Pierre', 'Clinet', 'pierre@gmail.com', '$2b$10$h/UVkWJYNqsPd0OkwzAQyuIwCgL9ag22GjKZNbKFJTRX9ELsGYY66', NULL, 0.00, 0.00, 2, '2025-05-27 15:44:47', NULL, 0),
(9, 'Oliviet', 'Poire', 'olivier@gmail.com', '$2b$10$JF19zSX9jl6ce0JGQXuSO.EPkiSUF.iP2uoVnMtGdJD2hHT4uhVbK', NULL, 0.00, 0.00, 2, '2025-05-27 15:45:17', NULL, 0),
(10, 'Alice', 'Maison', 'alice@gmail.com', '$2b$10$GxPDt7EMVB.HkmjJ2aN0/O87BAPTtGAQzO2BoHoKwUSHORGi8MBKu', NULL, 0.00, 0.00, 2, '2025-05-27 15:45:40', NULL, 0),
(11, 'Manon', 'colle', 'manon@gmail.com', '$2b$10$GzH7FbDhdbjtegvrltLy6efOmhotrbATHEduZ3Yg3ytDx/dAhZrfC', NULL, 0.00, 0.00, 2, '2025-05-27 15:46:07', NULL, 0),
(12, 'Julien', 'Louche', 'julien@gmail.com', '$2b$10$lDNrO6LsVX6VVGyQRA2PH.zZMcxLLz014D8fcceGk6ysyFPr1huHm', NULL, 0.00, 0.00, 2, '2025-05-27 15:52:46', NULL, 0),
(13, 'admin', 'admin', 'admin@gmail.com', '$2b$10$SWvG/0fxRNCadvXfmws.U.A9kYNN5bXPi3aUxV2pLJFEtkSyISe7i', NULL, 0.00, 0.00, 1, '2025-08-07 03:49:23', NULL, 0),
(14, 'hub', 'hub', 'hub@gmail.com', '$2b$10$J6E5FeXEbSmXGRQxmLgBXeX0igyZoLmrDAonve8BhQKQ7m8WZyY02', NULL, 0.00, 0.00, 3, '2025-08-07 03:50:28', NULL, 0),
(15, 'Leo', 'Oel', 'dreden.belgium@gmail.com', '$2b$10$eSyWKRrkaq4zgvaMQNBIOO/Gcl3X1U/ifeRGwcjy4DAkIsiNoIaFS', NULL, 0.00, 0.00, 2, '2025-08-07 03:51:40', NULL, 0),
(20, 'User', 'User', 'user@gmail.com', '$2b$10$QiSBCO6uorRB8LG9FoF/VOv3mThftG0lVKvMuD/fkc8L.qX83CERq', 9, 0.00, -15.00, 2, '2025-08-18 21:54:24', NULL, 0),
(21, 'user', 'Prof', 'prof.user@gmail.com', '$2b$10$0DAw8Mqn6nPJoY1AoIDryOcG9PuJEwoOa6Z.eOwjPy04uYXtUTUqa', NULL, 0.00, 0.00, 2, '2025-08-19 05:45:02', NULL, 0),
(22, 'Admin', 'Prof', 'prof.admin@gmail.com', '$2b$10$xt/ZNWpxmT7t5/49rhxR1etmXgp3ehrfQE66Jd7bEzGixksMqtz7q', NULL, 0.00, 0.00, 1, '2025-08-19 05:45:21', NULL, 0),
(23, 'Hub', 'Prof', 'prof.hub@gmail.com', '$2b$10$Mh87qSgsXdNo7yWS7CIJJOJ4RuoZ7u1wCB162zZnnIOFxqsORl066', NULL, 0.00, 0.00, 3, '2025-08-19 05:45:31', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `user_statu`
--

CREATE TABLE `user_statu` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_statu`
--

INSERT INTO `user_statu` (`id`, `name`) VALUES
(1, 'ADMIN'),
(2, 'CLIENT'),
(3, 'HUB');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `news_image`
--
ALTER TABLE `news_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `news_id` (`news_id`);

--
-- Index pour la table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_transaction_order` (`order_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `subscription_id` (`subscription_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Index pour la table `user_statu`
--
ALTER TABLE `user_statu`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `news`
--
ALTER TABLE `news`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `news_image`
--
ALTER TABLE `news_image`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `order`
--
ALTER TABLE `order`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT pour la table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT pour la table `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `user_statu`
--
ALTER TABLE `user_statu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `news_image`
--
ALTER TABLE `news_image`
  ADD CONSTRAINT `news_image_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Contraintes pour la table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Contraintes pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `fk_transaction_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`id`),
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `user_statu` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
