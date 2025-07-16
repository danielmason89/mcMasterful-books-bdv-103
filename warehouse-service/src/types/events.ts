export interface BookStockedEvent {
  type: 'BookStocked';
  data: {
    bookId: string;
    title: string;
    quantity: number;
  };
}