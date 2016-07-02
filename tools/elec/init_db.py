#!/usr/bin/python

import datetime
import decimal
import os
import sqlite3

_DATABASE_FILE_NAME = 'elec.sqlite3'
_DATA_FILE_NAME = 'elec.csv'

###############################################################################


def get_database_path(db_file_name):
    app_root = os.path.abspath(__file__)
    for i in xrange(3):
        app_root = os.path.dirname(app_root)
    return os.path.join(app_root, 'elec', db_file_name)


def delete_database(db_path):
    print 'delete database [{}] ...'.format(db_path),
    if os.path.exists(db_path):
        os.unlink(db_path)
        print 'done'
    else:
        print 'not exists, skip'


def create_database(db_path):
    sqlscript = '''
CREATE TABLE [bills]
(
    [id]                INTEGER NOT NULL PRIMARY KEY,
    [bill_date]         DATE    NOT NULL,
    [peak_time_power]   INTEGER NOT NULL,
    [valley_time_power] INTEGER NOT NULL,
    [peak_time_price]   TEXT    NOT NULL,
    [valley_time_price] TEXT    NOT NULL,
    [price]             TEXT    NOT NULL
)'''
    print 'create database [{}] ...'.format(db_path),
    db = sqlite3.connect(db_path)
    db.executescript(sqlscript)
    db.commit()
    db.close()
    print 'done'


def get_data_file_path(data_file_name):
    script_path = os.path.dirname(__file__)
    return os.path.join(script_path, data_file_name)


def populate_data(db_path, data_file_path):
    print 'populate data from [{}] ...'.format(data_file_path),
    sql = '''
INSERT INTO [bills]
            (
                [bill_date],
                [peak_time_power],
                [valley_time_power],
                [peak_time_price],
                [valley_time_price],
                [price]
            )
     VALUES (?, ?, ?, ?, ?, ?)
'''
    db = sqlite3.connect(db_path)

    def adapter_Decimal(d):
        return str(d)

    sqlite3.register_adapter(decimal.Decimal, adapter_Decimal)

    with open(data_file_path) as f:
        for line in f:
            line = line.strip()
            if line[0] == '#':
                continue
            args = line.split(',')
            args = [i.strip() for i in args]
            args[0] = datetime.date(*map(int, args[0].split('-')))
            args[1:3] = map(int, args[1:3])
            args[3:] = map(decimal.Decimal, args[3:])
            db.execute(sql, args)
    db.commit()
    db.close()
    print 'done'


###############################################################################

if __name__ == '__main__':
    db_path = get_database_path(_DATABASE_FILE_NAME)
    delete_database(db_path)
    create_database(db_path)
    data_file_path = get_data_file_path(_DATA_FILE_NAME)
    populate_data(db_path, data_file_path)
