# Chi-Square Feature Selection

A chi-square feature selection module based on the research done by Wang, D., Liang, Y., Xu, D., Feng, X., & Guan, R. [[1]](#1) written in NodeJs that processes scientific journal and scientific article abstract data. This module will determine the most dependent set of words to a given set of journals. The more dependent a word is to a journal, the more representative that word is to the journal.

## How To Run

```shell
$ node src/index.js
```

## Features

- Aggregates 150 words with the highest chi-square value for each journal and remove any duplicate words.
- Groups 150 words with the highest chi-square value for each journal by their respective journals.
- Logs the `A`, `B`, `C`, `D` variables for each word to each journal as well as their chi-square value.

## How It Works

This module uses a version of the chi-square equation from [[1]](#1) to calculate the dependence of a word to a journal :

<center>

![equation](https://latex.codecogs.com/gif.latex?X_{(t,c)}^{2}\approx\frac{(A*D-B*C)^{2}}{(A+B)*(C+D)})

</center>
 
where:
  - ![variable-a](https://latex.codecogs.com/gif.latex?A) is the number of documents including word ![variable word](https://latex.codecogs.com/gif.latex?t), which belongs to journal ![variable journal](https://latex.codecogs.com/gif.latex?c).
  - ![variable-b](https://latex.codecogs.com/gif.latex?B) is the number of documents including word ![variable word](https://latex.codecogs.com/gif.latex?t), which does not belong to journal ![variable journal](https://latex.codecogs.com/gif.latex?c).
  - ![variable-c](https://latex.codecogs.com/gif.latex?C) is the number of documents in journal ![variable journal](https://latex.codecogs.com/gif.latex?c), which does not include word ![variable word](https://latex.codecogs.com/gif.latex?t).
  - ![variable-d](https://latex.codecogs.com/gif.latex?D) is the number of documents in journals other than journal ![variable journal](https://latex.codecogs.com/gif.latex?c), which does not include word ![variable word](https://latex.codecogs.com/gif.latex?t).
  

## Input

The input file can be found in the `./data/input/` directory, which happens to be a `.json` file  that stores a `list` of `.json objects` with the following structure :  

```json
[
  {
      "JOURNAL_ID": 0,
      "JOURNAL_TITLE": "Jurnal Hortikultura",
      "ARTICLE_ID": 0,
      "ARTICLE_TITLE": "SISTEM TANAM TUMPANG SARI CABAI MERAH DENGAN ... DAN BUNCIS TEGAK ",
      "ARTICLE_ABSTRACT": "Pola tanam tumpang sari merupakan salah satu cara untuk meningkatkan efisiensi ... tumpang sari cabai dengan kentang dan bawang merah merupakan usahatani yang paling menguntungkan terutama apabila dibandingkan dengan monokultur.",
      "TOKENS": [ "pola", "tanam", "tumpang", "sari", "rupa", "salah", "tingkat", "efisiensi", ... , "tumpang", "sari", "usahatani", "tumpang", "sari", "cabai", "kentang", "bawang", "merah", "rupa", "usahatani", "untung", "utama", "banding", "monokultur" ],
      "TOKENS_DUPLICATE_REMOVED": [ "pola", "tanam", "tumpang", "sari", "rupa", "salah", ... , "tumbuh", "vegetatif", "beda", "nyata", "tara", "untung", "bersih", "usahatani", "utama", "banding" ]
  },
  ... ,
  {
      "JOURNAL_ID": Number,
      "JOURNAL_TITLE": String,
      "ARTICLE_ID": Number,
      "ARTICLE_TITLE": String,
      "ARTICLE_ABSTRACT": String,
      "TOKENS": Array,
      "TOKENS_DUPLICATE_REMOVED": Array
  }
]
```

## Output

This module produces three different outputs that are saved in three different files:

1. In the directory `./data/output/fv-tokens.json`. This file is used to save the 150 aggregated words with the highest chi-square value for each journal and removes any duplicate words.

    ```json
    [
      "tanam",
      "balai",
      "varietas",
      "ulang",
      "sayur",
       ... ,
      "kawat",
      "struktur",
      "superplasticizer",
      "wulung"
    ]
    ```

2. In the directory `./data/output/fv-tokens-by-journal.json`. This file is used to save the grouped 150 words with the highest chi-square values by their respectives journals.

    ```json
    {
      "0": [
        "tanam",
        "balai",
        "varietas",
        "ulang",
        "sayur",
         ... ,
        "hasil",
        "manggis",
        "patogen"
      ],
      ... ,
      "n_journals" : [
        String,
        String,
        String,
        ... ,
        String,
        String
      ]
    }
    ```

3. In the directory `./data/output/chi-square-feature-vectors.json`. This file is used to log the `A`, `B`, `C`, `D`, journal ID and chi-square value for each word.

    ````json
    [
      {
        "JOURNAL_ID": 0,
        "TOKEN": "tanam",
        "A_VALUE": 626,
        "B_VALUE": 501,
        "C_VALUE": 137,
        "D_VALUE": 6633,
        "CHI_SQUARE": 2185638.198645179
      },
      ... ,
      {
        "JOURNAL_ID": Number,
        "TOKEN": String,
        "A_VALUE": Number,
        "B_VALUE": Number,
        "C_VALUE": Number,
        "D_VALUE": Number,
        "CHI_SQUARE": Number
      }
    ]
    ````

## Library Used

- [csv-writer](https://www.npmjs.com/package/csv-writer)
- [lodash.groupby](https://www.npmjs.com/package/lodash.groupby)
- [lodash.mapvalues](https://www.npmjs.com/package/lodash.mapvalues)
- [lodash.uniqby](https://www.npmjs.com/package/lodash.uniqby)
- [neat-csv](https://www.npmjs.com/package/neat-csv)

## Demo

![demo-gif](https://media.giphy.com/media/Rf4xdYQHIW4vLBS66p/giphy.gif)

## References

<a id="1">[1]</a> 
Wang, D., Liang, Y., Xu, D., Feng, X., & Guan, R. (2018).
A content-based recommender system for computer science publications.Knowledge-Based Systems, 157, 1-9. 


## License

MIT © [ssentinull](https://github.com/ssentinull)