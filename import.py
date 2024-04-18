#My import file.
#Feb 4 2024

import os
import csv
from sqlalchemy import create_engine, text

from sqlalchemy.orm import scoped_session, sessionmaker

engine =create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


def create_user_table():
    """This function creates the user table. I call it below but have it commented out because I don't need to recreate it over and over"""
    print(os.getenv("DATABASE_URL"))
    create_user_table = text("""
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL unique,
        password VARCHAR NOT NULL,
        stravauser VARCHAR NOT NULL,
        stravapass VARCHAR NOT NULL
      );
    """)
    global db
    db.execute(create_user_table)
    db.commit()
    print("User Table Created")

if __name__ == '__main__':
    #create_user_table()
    print('mac')
