(function() {
  'use strict';

  angular
    .module('bq')
    .factory('bmodule', bmodule);

  /* @ngInject */
  function bmodule($q, $cordovaSQLite, notify, common, mock) {
    function newModule(db) {
      return new BModule(db);
    }

    function stripTags(string) {
      // remove HTML tags
      // FIXME: refactoring is needed

      return string.replace(/<(?:.|\n)*?>/gm, ''); //leaves tags content
    }

    function stripTagsAndContent(string) {
      // remove HTML tags
      // FIXME: refactoring is needed

      var str = string.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, ''); // removes tag content
      str = str.replace(/<(?:.|\n)*?>/gm, ''); //leaves tags content
      return str;
    }

    function BModule(db) {
      this.db = db;
      this.chapters = {};
      this.books = {};
      this.type = 0; // 0 - Bible, 1 - Commentaries
      this.name = db.dbname.slice(0, db.dbname.toLowerCase().indexOf('.sqlite3'));
      var d = $q.defer();

      if (this.name.indexOf('.commentaries') > 0) {
        this.type = 1;
        this.chapter_string = 'Глава';
        this.name = this.name.slice(0, this.name.indexOf('.commentaries'));
      }

      var self = this;
      $cordovaSQLite.execute(this.db, 'SELECT * FROM info')
        .then(function(res) {
          for (var i = 0; i < res.rows.length; i++) {
            self[res.rows.item(i).name] = res.rows.item(i).value;
          }
          return d.resolve(self);
        }, function(err) {
          return d.reject(err);
        });
      
      return d.promise;
    }
    BModule.prototype.loadBooks = function() {
      var self = this;
      var d = $q.defer();
      //var books = [];

      if (common.debug) {
        return mock.load('books.json').then(function(books) {
          for (var i = 0; i < books.length; i++) {
            self.books[books(i).book_number] = books(i);
          }
          d.resolve(books);
        });
      }
      if (Object.keys(this.books).length === 0) {
        notify.show();
        var query;
        if (self.type == 1) {
          query = 'SELECT DISTINCT book_number FROM commentaries';
        } else {
          query = 'SELECT * FROM books';
        }
        $cordovaSQLite.execute(this.db, query)
          .then(function(res) {
            var num;
            for (var i = 0; i < res.rows.length; i++) {
              if (self.type == 1) {
                num = res.rows.item(i).book_number;
                if (common.defaultBooks.hasOwnProperty(num)) {
                  self.books[num] = common.defaultBooks[num];
                } else {
                  self.books[num] = {
                    "long_name": "Неизвестный модуль",
                    "short_name": num + '',
                    "book_color": "#fff",
                    "book_number": num + ''
                  };
                }
              } else {
                self.books[res.rows.item(i).book_number] = res.rows.item(i);
              }
            }
            //console.log(JSON.stringify(self.books));
            d.resolve(self.books);
            notify.hide();
          }, function(err) {
            notify.alert(err);
            d.reject(err);
            notify.hide();
          });
      } else {
        d.resolve(self.books);
      }
      return d.promise;
    };
    BModule.prototype.getBook = function(bookId) {
      var d = $q.defer();
      var self = this;
      if (Object.keys(this.books).length === 0) {
        this.loadBooks().then(function() {
          d.resolve(self.books[bookId]);
        });
      } else {
        d.resolve(self.books[bookId]);
      }
      return d.promise;
    };
    BModule.prototype.loadChapters = function(bookId) {
      var self = this;
      var d = $q.defer();
      var chapters = [];

      if (!self.chapters.hasOwnProperty(bookId)) {
        notify.show();
        var query;
        if (self.type == 1) {
          query = 'SELECT text, chapter_number_from, chapter_number_to FROM commentaries ' +
            'WHERE book_number = ?' +
            'GROUP BY (chapter_number_from)' +
            'ORDER BY chapter_number_from, verse_number_from';
        } else {
          query = 'SELECT chapter, text FROM verses WHERE verse = 1 AND book_number = ?';
        }

        // load first verse of each chapter
        $cordovaSQLite.execute(this.db, query, [bookId])
          .then(function(res) {
            //console.dir(res);
            for (var i = 0; i < res.rows.length; i++) {
              res.rows.item(i).text = stripTagsAndContent(res.rows.item(i).text.slice(0, 256));
              if (self.type == 1) {
                //FIXME: нуно дописать правильную обработку from и to
                chapters.push({
                  text: res.rows.item(i).text,
                  chapter: res.rows.item(i).chapter_number_from
                });
              } else {
                chapters.push(res.rows.item(i));
              }
            }
            //console.log(JSON.stringify(chapters));
            self.chapters[bookId] = chapters;
            d.resolve(self.chapters[bookId]);
            notify.hide();
          }, function(err) {
            notify.alert(err);
            d.reject(err);
            notify.hide();
          });
      } else {
        d.resolve(self.chapters[bookId]);
      }
      return d.promise;
    };
    BModule.prototype.getChapter = function(bookId, chapterId) {
      var d = $q.defer();
      var self = this;

      function findChapter() {
        var chap = null;
        for (var i = 0; i < self.chapters[bookId].length; i++) {
          if (self.chapters[bookId][i].chapter == chapterId) {
            chap = self.chapters[bookId][i];
            break;
          }
        }
        return chap;
      }
      if (!self.chapters.hasOwnProperty(bookId)) {
        self.loadChapters(bookId).then(function() {
          d.resolve(findChapter());
        });
      } else {
        d.resolve(findChapter());
      }
      return d.promise;
    };
    BModule.prototype.loadPage = function(bookId, chapterId) {
      notify.show();
      var self = this;
      var d = $q.defer();
      var page = [];
      var query, vars;
      if (self.type == 1) {
        if (chapterId == 0) {
          // Intro text
          query = 'SELECT text, verse_number_from, verse_number_to FROM commentaries ' +
            'WHERE book_number = ? AND chapter_number_from = 0 AND chapter_number_to is Null ' +
            'ORDER BY verse_number_from';
          vars = [bookId];
        } else {
          query = 'SELECT text, verse_number_from, verse_number_to FROM commentaries ' +
            'WHERE book_number = ? AND chapter_number_from >= ? AND chapter_number_to <= ?' +
            'ORDER BY verse_number_from';
          vars = [bookId, chapterId, chapterId];
        }
      } else {
        query = 'SELECT verse, text FROM verses WHERE book_number = ? AND chapter = ? ORDER BY verse';
        vars = [bookId, chapterId];
      }
      $cordovaSQLite.execute(this.db, query, vars)
        .then(function(res) {
          //console.log(res);
          for (var i = 0; i < res.rows.length; i++) {
            // FIXME: tags should work!
            if (self.type == 1) {
              // comments
              var verse;
              if (chapterId == 0) {
                verse = '[*]';
              } else if (res.rows.item(i).verse_number_from == res.rows.item(i).verse_number_to) {
                verse = res.rows.item(i).verse_number_from;
              } else {
                verse = res.rows.item(i).verse_number_from + ' - ' + res.rows.item(i).verse_number_to;
              }
              page.push({
                text: res.rows.item(i).text,
                verse: verse
              });
            } else {
              // books
              //res.rows.item(i).text = stripTagsAndContent(res.rows.item(i).text);
              page.push(res.rows.item(i));
            }
          }
          notify.hide();
          d.resolve(page);
        }, function(err) {
          notify.hide();
          notify.alert(err);
          d.reject(err);
        });
      return d.promise;
    };
    BModule.prototype.loadVerse = function(bookId, chapterId, verseId) {
      var d = $q.defer();
      var self = this;
      var query, vars;
      if (self.type == 1) {
        query = 'SELECT text, verse_number_from, verse_number_to FROM commentaries ' +
          'WHERE book_number = ? AND chapter_number_from >= ? AND chapter_number_to <= ?' +
          'ORDER BY verse_number_from';
        vars = [bookId, chapterId, verseId];
      } else {
        query = 'SELECT verse, text FROM verses WHERE book_number = ? AND chapter = ? AND verse = ?';
        vars = [bookId, chapterId, verseId];
      }

      $cordovaSQLite.execute(this.db, query, vars)
        .then(function(res) {
          var verses = [];
          for (var i = 0; i < res.rows.length; i++) {
            verses.push(res.rows.item(i).text);
          }
          d.resolve(verses.join(' '));
        });

      return d.promise;
    };

    ////////////////

    var service = {
      newModule: newModule
    };
    return service;
  }
})();
