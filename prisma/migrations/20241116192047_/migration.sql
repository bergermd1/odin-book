/*
  Warnings:

  - You are about to drop the `commentLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "commentLike" DROP CONSTRAINT "commentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "commentLike" DROP CONSTRAINT "commentLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "postLike" DROP CONSTRAINT "postLike_postId_fkey";

-- DropForeignKey
ALTER TABLE "postLike" DROP CONSTRAINT "postLike_userId_fkey";

-- DropTable
DROP TABLE "commentLike";

-- DropTable
DROP TABLE "postLike";
