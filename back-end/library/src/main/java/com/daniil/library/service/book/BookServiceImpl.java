package com.daniil.library.service.book;

import com.daniil.library.dao.BookDAO;
import com.daniil.library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookDAO bookDAO;

    public BookServiceImpl(BookDAO bookDAO) {
        this.bookDAO = bookDAO;
    }

    @Override
    public Book findById(int id) {
        return bookDAO.findById(id).orElse(null);
    }

    @Override
    public Page<Book> findAll(int page, int size) {
        return bookDAO.findAll(PageRequest.of(page, size));
    }

    @Override
    public void save(Book book) {
        bookDAO.save(book);
    }

    @Override
    public void deleteById(int id) {
        bookDAO.deleteById(id);
    }
}
