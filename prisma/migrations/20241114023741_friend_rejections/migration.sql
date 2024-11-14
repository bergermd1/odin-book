-- CreateTable
CREATE TABLE "_friendRejections" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friendRejections_AB_unique" ON "_friendRejections"("A", "B");

-- CreateIndex
CREATE INDEX "_friendRejections_B_index" ON "_friendRejections"("B");

-- AddForeignKey
ALTER TABLE "_friendRejections" ADD CONSTRAINT "_friendRejections_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friendRejections" ADD CONSTRAINT "_friendRejections_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
