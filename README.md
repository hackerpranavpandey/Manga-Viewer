# Manga-Viewer

# Manga Viewer Application

This is a simple Manga Viewer application that allows users to browse manga books, navigate through chapters and pages, and transition between them smoothly. The application fetches manga data from an external API.

## Features

- **Booklist**: On the top of the screen, there are buttons with the manga book titles. You can switch between books by clicking the button. (Time: 0:06 - 0:12)
  
- **Chapter List**: Below the title buttons, there are buttons with the chapter numbers. A chapter can be switched by clicking the buttons. (Time: 0:14 - 0:24)
  
- **Page Transition**: By clicking the left side of the image, you can move to the next page. By clicking the right side of the image, you can move to the previous page. (Time: 0:27 - 0:40)

- **Page Transition Between Chapters**: If you try to move to the next page from the last page of a chapter, you automatically move to the next chapter. Similarly, moving to the previous page from the first page of a chapter takes you to the previous chapter's last page. (Time: 0:47 - 0:58)

## API

The Manga Viewer application fetches data from a prepared API server. This API is used to get manga titles, image URLs, and chapter details.

- **API Base URL**: `http://52.195.171.228:8080/`

### List of APIs

- `/books/`: List of books.
- `/books/:bookId`: Detail of books.
- `/chapters/:chapterId/`: Detail of chapters.

> **Note**: Ensure to append a slash `/` at the end of the URL like `http://52.195.171.228:8080/books/`, not `http://52.195.171.228:8080/books`.

## Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
