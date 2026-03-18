/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80040
Source Host           : localhost:3306
Source Database       : dream_store

Target Server Type    : MYSQL
Target Server Version : 80040
File Encoding         : 65001

Date: 2025-01-23 13:34:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `dream_score`
-- ----------------------------
DROP TABLE IF EXISTS `dream_score`;
CREATE TABLE `dream_score` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) CHARACTER SET utf32 NOT NULL,
  `score_type` int NOT NULL COMMENT '使用理想值类型：1、获取理想值；2、消耗理想值',
  `score_number` int NOT NULL COMMENT '获取/消耗理想值',
  `task_id` int DEFAULT NULL COMMENT '任务ID',
  `store_id` int DEFAULT NULL COMMENT '理想ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of dream_score
-- ----------------------------

-- ----------------------------
-- Table structure for `dream_store`
-- ----------------------------
DROP TABLE IF EXISTS `item_store`;
CREATE TABLE `item_store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `dream_item` varchar(100) CHARACTER SET utf32 NOT NULL COMMENT '理想物品',
  `dream_consume_score` int NOT NULL COMMENT '消耗理想值',
  `dream_photo` text CHARACTER SET utf32 COMMENT '理想照片',
  `is_exchange` int NOT NULL DEFAULT '0' COMMENT '是否完成兑换：0：未兑换；1：已兑换；',
  `is_del` int NOT NULL DEFAULT '1' COMMENT '是否删除：0：已删除；1：未删除；',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of dream_store
-- ----------------------------

-- ----------------------------
-- Table structure for `task_history`
-- ----------------------------
DROP TABLE IF EXISTS `task_history`;
CREATE TABLE `task_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `task_id` int NOT NULL,
  `finish_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of task_history
-- ----------------------------

-- ----------------------------
-- Table structure for `task_list`
-- ----------------------------
DROP TABLE IF EXISTS `task_list`;
CREATE TABLE `task_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `task` varchar(255) CHARACTER SET utf32 NOT NULL COMMENT '任务',
  `is_finish` int NOT NULL DEFAULT 0 COMMENT '是否完成：0：未完成；1：已完成；',
  `is_del` int NOT NULL DEFAULT 1 COMMENT '是否删除：0：已删除；1：未删除；',
  'dream_store' int NOT NULL DEFAULT 1 COMMENT '完成所获获得理想值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of task_list
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) CHARACTER SET utf32 NOT NULL DEFAULT '' COMMENT '用户名',
  `user_open_id` varchar(255) CHARACTER SET utf32 NOT NULL COMMENT '用户ID码',
  `user_photo` longtext CHARACTER SET utf32 COMMENT '用户头像base64',
  `user_total_score` bigint NOT NULL DEFAULT '0' COMMENT '用户总理想值',
  `user_total_lost_points` bigint NOT NULL DEFAULT '0' COMMENT '已完成理想值',
  `user_current_score` bigint unsigned NOT NULL DEFAULT '0' COMMENT '当前理想值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
