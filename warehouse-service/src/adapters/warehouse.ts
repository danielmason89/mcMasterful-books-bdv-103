import { publishBookStocked } from '../messaging/publish';

export async function placeBooksOnShelf(bookId: string, title: string, quantity: number): Promise<void> {
  // Save to database or memory – mock logic
  console.log(`Placed ${quantity} of ${title} on shelf.`);

  // Publish message
  await publishBookStocked({
    type: 'BookStocked',
    data: {
      bookId,
      title,
      quantity,
    },
  });
}