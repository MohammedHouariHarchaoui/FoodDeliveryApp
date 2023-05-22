-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(120) NOT NULL,
    `lastname` VARCHAR(120) NOT NULL,
    `phoneNumber` VARCHAR(120) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `address` VARCHAR(120) NOT NULL,
    `password` VARCHAR(120) NOT NULL,
    `profilPictureUrl` VARCHAR(200) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` INTEGER NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deliveryMan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRestaurant` INTEGER NOT NULL,
    `firstname` VARCHAR(120) NOT NULL,
    `lastname` VARCHAR(120) NOT NULL,
    `phoneNumber` VARCHAR(120) NOT NULL,
    `profilPictureUrl` VARCHAR(200) NOT NULL,
    `status` ENUM('OCCUPED', 'AVAILABLE', 'OFFSHIFT') NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `deliveryMan_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Restaurant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `logoPictureUrl` VARCHAR(200) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `cuisineType` ENUM('ITALIAN', 'MEXICAN', 'CHINESE', 'JAPANESE', 'FRENCH', 'AMERICAN', 'INDIAN', 'SYRIAN') NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `openingTime` DATETIME(3) NOT NULL,
    `closingTime` DATETIME(3) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `instagram` VARCHAR(120) NOT NULL,
    `facebook` VARCHAR(120) NOT NULL,
    `averageRating` DOUBLE NOT NULL,
    `numberOfReviews` INTEGER NOT NULL,
    `deliveryFees` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Restaurant_name_key`(`name`),
    UNIQUE INDEX `Restaurant_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRestaurant` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `category` ENUM('APPETIZERS', 'MAIN_COURSES', 'SEAFOOD', 'POULTRY', 'BEEF', 'VEGETARIAN_VEGAN', 'PASTA', 'PIZZA', 'SANDWICHES_WRAPS', 'SALADS', 'SOUPS', 'DESSERTS', 'BEVERAGES', 'BREAKFAST') NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `image` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRestaurant` INTEGER NOT NULL,
    `idUser` INTEGER NOT NULL,
    `rating` DOUBLE NOT NULL,
    `comment` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitudue` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `deliveryNote` VARCHAR(500) NOT NULL,
    `idDeliveryMan` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItems` (
    `idDish` INTEGER NOT NULL,
    `idOrder` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `dishNote` VARCHAR(500) NOT NULL,
    `status` ENUM('PENDING', 'DELIVERED', 'CANCELED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idDish`, `idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
