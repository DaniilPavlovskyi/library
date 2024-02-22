package com.daniil.library.controller;


import com.daniil.library.entity.Author;
import com.daniil.library.entity.Book;
import com.daniil.library.entity.Client;
import com.daniil.library.entity.Loan;
import com.daniil.library.security.JwtUtil;
import com.daniil.library.service.author.AuthorService;
import com.daniil.library.service.book.BookService;
import com.daniil.library.service.client.ClientService;
import com.daniil.library.service.loan.LoanService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;


@RestController
@CrossOrigin(origins = "${link}")
public class BookRESTController {

    private final BookService bookService;
    private final AuthorService authorService;
    private final ClientService clientService;
    private final LoanService loanService;
    private final JwtUtil jwtUtil;

    public BookRESTController(BookService bookService, AuthorService authorService, ClientService clientService, LoanService loanService, JwtUtil jwtUtil) {
        this.bookService = bookService;
        this.authorService = authorService;
        this.clientService = clientService;
        this.loanService = loanService;
        this.jwtUtil = jwtUtil;
    }


    @GetMapping("api/books")
    public ResponseEntity<Map<String, Object>> books(@RequestParam(defaultValue = "1") Integer page,
                                                     @RequestParam(defaultValue = "9") Integer size) {
        Map<String, Object> content = new HashMap<>();
        Page<Book> books = bookService.findAll(page - 1, size);
        books.getContent().forEach(e -> {
            e.setAuthor(null);
            e.setLoans(null);
        });
        content.put("books", books.getContent());
        content.put("currentPage", page);
        content.put("totalPages", books.getTotalPages());
        return ResponseEntity.ok(content);
    }

    @GetMapping("api/books/{id}")
    public ResponseEntity<Book> book(@PathVariable String id) {
        Book book;
        try {
            int bookId = Integer.parseInt(id);
            book = bookService.findById(bookId);
            if (book == null) {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
        book.setLoans(null);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/api/author/{id}")
    public ResponseEntity<Author> author(@PathVariable String id) {
        Author author;
        try {
            int authorId = Integer.parseInt(id);
            author = authorService.findById(authorId);
            if (author == null) {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(author);
    }

    @PutMapping("api/update-book")
    public ResponseEntity<String> update(@RequestBody Map<String, String> bookInfo) {
        String bookId = bookInfo.get("id");
        String title = bookInfo.get("title");
        String category = bookInfo.get("category");
        String author = bookInfo.get("author");
        String publicationYear = bookInfo.get("publicationYear");
        String availability = bookInfo.get("availability");

        Book book;
        try {
            book = bookService.findById(Integer.parseInt(bookId));
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().build();
        }

        if (book == null) {
            return ResponseEntity.badRequest().build();
        }


        if (StringUtils.hasText(title)) {
            book.setTitle(title);
        }

        if (StringUtils.hasText(category)) {
            book.setCategory(category);
        }

        if (StringUtils.hasText(author)) {
            Author newAuthor = authorService.findByName(author);
            if (newAuthor != null) {
                book.setAuthor(newAuthor);
            }
        }

        if (StringUtils.hasText(publicationYear)) {
            try {
                int newPubYear = Integer.parseInt(publicationYear);
                if (newPubYear > 1) {
                    book.setPublicationYear(newPubYear);
                }
            } catch (NumberFormatException ignored) {
            }
        }

        if (StringUtils.hasText(availability)) {
            try {
                int newAvailability = Integer.parseInt(availability);
                if (newAvailability != -1) {
                    book.setPresent(newAvailability != 0);
                }
            } catch (NumberFormatException ignored) {
            }
        }

        bookService.save(book);

        return ResponseEntity.ok("Success");
    }

    @DeleteMapping("/api/delete-book/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable String id) {
        Book book;
        try {
            int bookId = Integer.parseInt(id);
            bookService.deleteById(bookId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("Success");
    }


    @PostMapping("api/create-book")
    public ResponseEntity<String> create(@RequestBody Map<String, String> bookInfo) {
        String title = bookInfo.get("title");
        String category = bookInfo.get("category");
        String authorName = bookInfo.get("author");
        String publicationYear = bookInfo.get("publicationYear");
        String availability = bookInfo.get("availability");

        if (!StringUtils.hasText(title) || !StringUtils.hasText(category) || !StringUtils.hasText(authorName)
                || !StringUtils.hasText(publicationYear) || !StringUtils.hasText(availability)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            int newPubYear = Integer.parseInt(publicationYear);
            int newAvailability = Integer.parseInt(availability);

            if (newPubYear <= 1) {
                return ResponseEntity.badRequest().build();
            }

            Author author = authorService.findByName(authorName);
            if (author == null) {
                return ResponseEntity.badRequest().build();
            }

            Book book = new Book();
            book.setTitle(title);
            book.setCategory(category);
            book.setAuthor(author);
            book.setPublicationYear(newPubYear);
            book.setPresent(newAvailability != 0);

            bookService.save(book);

            return ResponseEntity.ok("Success");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/api/new-loan/{id}")
    public ResponseEntity<String> loan(
            @PathVariable String id,
            @RequestBody Map<String, String> date,
            HttpServletRequest request
    ) {
        Loan loan = new Loan();
        String bearerToken = request.getHeader("Authorization");
        Client client = clientService.findByUsername(jwtUtil.extractUsername(bearerToken.substring(7)));
        Book book;

        try {
            int bookId = Integer.parseInt(id);
            book = bookService.findById(bookId);

            if (book == null) {
                return ResponseEntity.badRequest().build();
            }

            if (!book.isPresent()) {
                return ResponseEntity.badRequest().build();
            }

            LocalDate loanDate = LocalDate.parse(date.get("date"));

            loan.setBook(book);
            loan.setStart(LocalDate.now());
            loan.setEnd(loanDate);
            loan.setClient(client);
            loan.setStatus("started");

            book.addLoan(loan);
            book.setPresent(false);
            client.addLoan(loan);

            loanService.save(loan);
            clientService.save(client);
            bookService.save(book);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("Success");
    }


}
