import json
from utils import input_output, text_processing


DATASET_DIR = "./python/data/dataset-sample.csv"


def main():
    csv_data = input_output.read_csv(DATASET_DIR)

    for row in csv_data:
        ARTICLE_TITLE, ARTICLE_ABSTRACT, ARTICLE_ID, JOURNAL_ID, JOURNAL_TITLE = row.values()

        tokens = text_processing.generate_tokens(ARTICLE_ABSTRACT)


if __name__ == '__main__':
    main()
