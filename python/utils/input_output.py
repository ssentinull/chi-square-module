import csv
import io


def read_csv(file_dir):
    with io.open(file_dir, mode="r", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        dictionary_list = list(reader)

    return dictionary_list
