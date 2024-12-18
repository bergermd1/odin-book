/*
  Warnings:

  - Added the required column `userId` to the `commentLike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `postLike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commentLike" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "postLike" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "commentLike" ADD CONSTRAINT "commentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postLike" ADD CONSTRAINT "postLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
