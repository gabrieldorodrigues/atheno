const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking all articles...\n');
  
  const allArticles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      published: true,
      slug: true,
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  
  console.log(`Total articles: ${allArticles.length}`);
  console.log('\nAll articles:');
  allArticles.forEach(article => {
    console.log(`- ${article.title} (published: ${article.published}) by ${article.author.name}`);
  });
  
  console.log('\n\nChecking published articles only...\n');
  
  const publishedArticles = await prisma.article.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      published: true,
      slug: true,
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  
  console.log(`Published articles: ${publishedArticles.length}`);
  publishedArticles.forEach(article => {
    console.log(`- ${article.title} (slug: ${article.slug}) by ${article.author.name}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
