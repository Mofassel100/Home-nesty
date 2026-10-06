-- DropForeignKey
ALTER TABLE "HomeBanner" DROP CONSTRAINT "HomeBanner_userId_fkey";

-- AddForeignKey
ALTER TABLE "HomeBanner" ADD CONSTRAINT "HomeBanner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
