import json
from utils import input_output


DATASET_DIR = "./python/data/dataset-sample.csv"


def main():
    csv_data = input_output.read_csv(DATASET_DIR)


if __name__ == '__main__':
    main()
