package com.daniil.library.service.book;

import com.daniil.library.entity.Book;
import org.springframework.data.domain.Page;

import java.util.List;


public interface BookService {

    Book findById(int id);
    Page<Book> findAll(int page, int size);

    void save(Book book);
    void deleteById(int id);
}
