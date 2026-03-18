from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

# 连接到 SQLite 数据库
sqlite_engine = create_engine('sqlite:///dreamStore.db')
sqlite_metadata = MetaData()
sqlite_metadata.reflect(bind=sqlite_engine)

# 连接到 MySQL 数据库
mysql_engine = create_engine('mysql+pymysql://root:root@localhost:3306/dream_store_test')
mysql_metadata = MetaData()
mysql_metadata.reflect(bind=mysql_engine)

# 创建会话
SQLiteSession = sessionmaker(bind=sqlite_engine)
sqlite_session = SQLiteSession()

MySQLSession = sessionmaker(bind=mysql_engine)
mysql_session = MySQLSession()

try:
    # 遍历 SQLite 中的所有表
    for table in sqlite_metadata.tables.values():
        # 检查表是否存在于 MySQL 中，如果不存在则创建
        if table.name not in mysql_metadata.tables:
            table.create(bind=mysql_engine)

        # 从 SQLite 表中查询所有数据
        sqlite_rows = sqlite_session.query(table).all()

        # 将数据插入到 MySQL 表中
        for row in sqlite_rows:
            insert_values = {col.name: getattr(row, col.name) for col in table.columns}
            mysql_session.execute(table.insert().values(insert_values))

    # 提交 MySQL 会话
    mysql_session.commit()
    print("数据迁移成功！")
except Exception as e:
    print(f"数据迁移失败: {e}")
    mysql_session.rollback()
finally:
    # 关闭会话
    sqlite_session.close()
    mysql_session.close()

