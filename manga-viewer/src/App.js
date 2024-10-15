import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [goToLastPage, setGoToLastPage] = useState(false);

  // Fetch all books on component mount
  useEffect(() => {
    axios.get('http://52.195.171.228:8080/books/')
      .then(response => {
        setBooks(response.data);

        const firstBook = response.data[0];
        if (firstBook) {
          // Set the first book, first chapter, and ensure the first page is shown
          setSelectedBookId(firstBook.id);
          setChapters(firstBook.chapter_ids);
          setSelectedChapterId(firstBook.chapter_ids[0]); // Automatically set first chapter
        }
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedBookId !== null) {
      const selectedBook = books.find(book => book.id === selectedBookId);
      setChapters(selectedBook ? selectedBook.chapter_ids : []);
      setSelectedChapterId(null); // Reset selected chapter when book changes
      setPages([]); // Clear pages when a new book is selected
      setCurrentPageIndex(0); // Reset the page index when a new book is selected
    }
  }, [selectedBookId, books]);

  // Fetch pages for the selected chapter
  useEffect(() => {
    if (selectedChapterId !== null) {
      axios.get(`http://52.195.171.228:8080/chapters/${selectedChapterId}/`)
        .then(response => {
          setPages(response.data.pages);
          if (goToLastPage) {
            setCurrentPageIndex(response.data.pages.length - 1); // Go to the last page if flagged
            setGoToLastPage(false); // Reset the flag
          } else {
            setCurrentPageIndex(0); // Default to the first page
          }
        })
        .catch(error => {
          console.error('Error fetching chapter:', error);
        });
    }
  }, [selectedChapterId, goToLastPage]);

  // Handle the goToLastPage logic when transitioning chapters
  useEffect(() => {
    if (goToLastPage && pages.length > 0) {
      setCurrentPageIndex(pages.length - 1); // Ensure it goes to the last page after page data is loaded
      setGoToLastPage(false); // Reset the flag
    }
  }, [pages, goToLastPage]);

  // Function to go to the next chapter or next book's first chapter
  const goToNextChapterOrBook = () => {
    const currentBookIndex = books.findIndex(book => book.id === selectedBookId);
    const currentChapterIndex = chapters.findIndex(chapterId => chapterId === selectedChapterId);

    if (currentChapterIndex < chapters.length - 1) {
      // Go to the next chapter in the same book
      setSelectedChapterId(chapters[currentChapterIndex + 1]);
    } else if (currentBookIndex < books.length - 1) {
      // Go to the first chapter of the next book
      const nextBook = books[currentBookIndex + 1];
      setSelectedBookId(nextBook.id);
      setSelectedChapterId(nextBook.chapter_ids[0]);
    }
  };

  // Function to go to the previous chapter or previous book's last chapter
  const goToPreviousChapterOrBook = () => {
    const currentBookIndex = books.findIndex(book => book.id === selectedBookId);
    const currentChapterIndex = chapters.findIndex(chapterId => chapterId === selectedChapterId);

    if (currentChapterIndex > 0) {
      // Go to the previous chapter in the same book
      setSelectedChapterId(chapters[currentChapterIndex - 1]);
      setGoToLastPage(true); // Flag to go to the last page of the previous chapter
    } else if (currentBookIndex > 0) {
      // Go to the last chapter of the previous book
      const previousBook = books[currentBookIndex - 1];
      setSelectedBookId(previousBook.id);
      setSelectedChapterId(previousBook.chapter_ids[previousBook.chapter_ids.length - 1]);
      setGoToLastPage(true); // Flag to go to the last page of the previous book's last chapter
    }
  };

  // Handle click on image to move to the next or previous page
  const handleImageClick = (event) => {
    const { clientX } = event;
    const middle = window.innerWidth / 2;

    if (clientX < middle) {
      // Clicked on the left side (move to the next image)
      if (currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      } else {
        goToNextChapterOrBook(); // Go to the next chapter if at the last page
      }
    } else {
      if (currentPageIndex > 0) {
        setCurrentPageIndex(currentPageIndex - 1);
      } else {
        goToPreviousChapterOrBook(); // Go to the last page of the previous chapter if at the first page
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Display Book Buttons */}
      <div style={styles.booksContainer}>
        <div>
          {books.map(book => (
            <button
              key={book.id}
              onClick={() => setSelectedBookId(book.id)}
              style={{
                ...styles.button,
                backgroundColor: selectedBookId === book.id ? 'green' : 'gray',
              }}
            >
              {book.title}
            </button>
          ))}
        </div>
      </div>

      {/* Display Chapter Buttons */}
      {selectedBookId && chapters.length > 0 && (
        <div style={styles.chaptersContainer}>
          <div>
            {chapters.map((chapterId, index) => (
              <button
                key={chapterId}
                onClick={() => setSelectedChapterId(chapterId)}
                style={{
                  ...styles.button,
                  backgroundColor: selectedChapterId === chapterId ? 'green' : 'gray',
                }}
              >
                {index + 1} {/* Display chapter index starting from 1 */}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display Pages */}
      {selectedChapterId && pages.length > 0 && (
        <div style={styles.imageContainer} onClick={handleImageClick}>
          <img
            src={pages[currentPageIndex].image.file}
            alt={`Page ${currentPageIndex}`}
            style={styles.image}
          />
          <p>Page {currentPageIndex + 1} / {pages.length}</p>
        </div>
      )}

      {selectedChapterId && pages.length === 0 && (
        <p>Loading pages...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  booksContainer: {
    marginBottom: '20px',
  },
  chaptersContainer: {
    marginBottom: '20px',
  },
  button: {
    margin: '5px',
    padding: '10px',
    color: 'white',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
  },
  imageContainer: {
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
  },
  image: {
    width: '600px', // Set fixed width
    height: '800px', // Set fixed height
    objectFit: 'contain', // Maintain aspect ratio
  },
};

export default App;