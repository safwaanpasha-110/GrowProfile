-- AlterTable
ALTER TABLE "instagram_accounts" ADD COLUMN     "ig_business_id" TEXT,
ADD COLUMN     "page_access_token_encrypted" TEXT,
ADD COLUMN     "page_access_token_iv" TEXT,
ADD COLUMN     "page_access_token_tag" TEXT;
