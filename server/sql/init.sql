CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL
    );

CREATE TABLE
    memory_dump (
        user_id INT,
        memory_dump_loc VARCHAR(100),
        CONSTRAINT fk_memory_dump_users FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE TABLE
    analysis (
        user_id INT,
        analysis_id VARCHAR(100) UNIQUE NOT NULL PRIMARY KEY,
        analysis_status VARCHAR(20),
        CONSTRAINT fk_analysis_users FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE TABLE
    analysis_data (
        user_id INT,
        analysis_id VARCHAR(100) UNIQUE,
        analysis_data TEXT,
        CONSTRAINT fk_analysis_data_users FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT fk_analysis_data_analysis FOREIGN KEY (analysis_id) REFERENCES analysis (analysis_id)
    );
