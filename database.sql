-- База данных музыкального магазина
-- Создание таблиц

-- Таблица музыкантов
CREATE TABLE musicians (
    musician_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(100),
    role VARCHAR(50) -- исполнитель, композитор, дирижер, руководитель
);

-- Таблица инструментов
CREATE TABLE instruments (
    instrument_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Связь музыкантов и инструментов (многие-ко-многим)
CREATE TABLE musician_instruments (
    musician_id INTEGER REFERENCES musicians(musician_id) ON DELETE CASCADE,
    instrument_id INTEGER REFERENCES instruments(instrument_id) ON DELETE CASCADE,
    PRIMARY KEY (musician_id, instrument_id)
);

-- Таблица ансамблей
CREATE TABLE ensembles (
    ensemble_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- оркестр, квартет, квинтет и т.д.
    founded_year INTEGER,
    leader_id INTEGER REFERENCES musicians(musician_id)
);

-- Состав ансамблей
CREATE TABLE ensemble_members (
    ensemble_id INTEGER REFERENCES ensembles(ensemble_id) ON DELETE CASCADE,
    musician_id INTEGER REFERENCES musicians(musician_id) ON DELETE CASCADE,
    join_date DATE,
    PRIMARY KEY (ensemble_id, musician_id)
);

-- Таблица музыкальных произведений
CREATE TABLE compositions (
    composition_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    composer_id INTEGER REFERENCES musicians(musician_id),
    year_written INTEGER,
    genre VARCHAR(100)
);

-- Исполнения произведений
CREATE TABLE performances (
    performance_id SERIAL PRIMARY KEY,
    composition_id INTEGER REFERENCES compositions(composition_id),
    ensemble_id INTEGER REFERENCES ensembles(ensemble_id),
    performance_date DATE,
    venue VARCHAR(255)
);

-- Таблица компаний-производителей пластинок
CREATE TABLE record_companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    is_wholesale BOOLEAN DEFAULT FALSE
);

-- Таблица пластинок (компакт-дисков)
CREATE TABLE records (
    record_id SERIAL PRIMARY KEY,
    label_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    company_id INTEGER REFERENCES record_companies(company_id),
    release_date DATE,
    wholesale_price DECIMAL(10, 2),
    retail_price DECIMAL(10, 2),
    sold_last_year INTEGER DEFAULT 0,
    sold_current_year INTEGER DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0
);

-- Связь пластинок и исполнений
CREATE TABLE record_performances (
    record_id INTEGER REFERENCES records(record_id) ON DELETE CASCADE,
    performance_id INTEGER REFERENCES performances(performance_id) ON DELETE CASCADE,
    PRIMARY KEY (record_id, performance_id)
);

-- Триггеры для каскадных изменений

-- Триггер для автоматического удаления записей в musician_instruments при удалении музыканта
-- (уже реализовано через ON DELETE CASCADE)

-- Триггер для обновления количества проданных пластинок
CREATE OR REPLACE FUNCTION update_record_sales()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE records 
        SET sold_current_year = sold_current_year + 1
        WHERE record_id = NEW.record_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE records 
        SET sold_current_year = sold_current_year - 1
        WHERE record_id = OLD.record_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_sales
AFTER INSERT OR DELETE ON record_performances
FOR EACH ROW EXECUTE FUNCTION update_record_sales();

-- Триггер для проверки цены при обновлении
CREATE OR REPLACE FUNCTION check_retail_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.retail_price < NEW.wholesale_price THEN
        RAISE EXCEPTION 'Розничная цена не может быть меньше оптовой';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_price
BEFORE UPDATE ON records
FOR EACH ROW EXECUTE FUNCTION check_retail_price();

-- Пакет процедур и функций

-- 1) Количество музыкальных произведений заданного ансамбля
CREATE OR REPLACE FUNCTION get_ensemble_composition_count(p_ensemble_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT c.composition_id)
    INTO count
    FROM performances p
    JOIN compositions c ON p.composition_id = c.composition_id
    WHERE p.ensemble_id = p_ensemble_id;
    
    RETURN count;
END;
$$ LANGUAGE plpgsql;

-- 2) Вывод названия всех компакт-дисков заданного ансамбля
CREATE OR REPLACE FUNCTION get_ensemble_records(p_ensemble_id INTEGER)
RETURNS TABLE(record_title VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT r.title
    FROM records r
    JOIN record_performances rp ON r.record_id = rp.record_id
    JOIN performances p ON rp.performance_id = p.performance_id
    WHERE p.ensemble_id = p_ensemble_id;
END;
$$ LANGUAGE plpgsql;

-- 3) Лидеры продаж текущего года
CREATE OR REPLACE FUNCTION get_top_sellers()
RETURNS TABLE(record_title VARCHAR, sold_count INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT r.title, r.sold_current_year
    FROM records r
    ORDER BY r.sold_current_year DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 4) Процедура для добавления нового ансамбля
CREATE OR REPLACE PROCEDURE add_ensemble(
    p_name VARCHAR,
    p_type VARCHAR,
    p_founded_year INTEGER,
    p_leader_id INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_ensemble_id INTEGER;
BEGIN
    INSERT INTO ensembles (name, type, founded_year, leader_id)
    VALUES (p_name, p_type, p_founded_year, p_leader_id)
    RETURNING ensemble_id INTO new_ensemble_id;
    
    RAISE NOTICE 'Ансамбль создан с ID: %', new_ensemble_id;
END;
$$;

-- 5) Процедура для добавления музыканта в ансамбль
CREATE OR REPLACE PROCEDURE add_musician_to_ensemble(
    p_ensemble_id INTEGER,
    p_musician_id INTEGER,
    p_join_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO ensemble_members (ensemble_id, musician_id, join_date)
    VALUES (p_ensemble_id, p_musician_id, p_join_date);
    
    RAISE NOTICE 'Музыкант добавлен в ансамбль';
END;
$$;

-- 6) Процедура для обновления данных о пластинке
CREATE OR REPLACE PROCEDURE update_record_data(
    p_record_id INTEGER,
    p_wholesale_price DECIMAL,
    p_retail_price DECIMAL,
    p_stock_quantity INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE records
    SET wholesale_price = COALESCE(p_wholesale_price, wholesale_price),
        retail_price = COALESCE(p_retail_price, retail_price),
        stock_quantity = COALESCE(p_stock_quantity, stock_quantity)
    WHERE record_id = p_record_id;
    
    RAISE NOTICE 'Данные о пластинке обновлены';
END;
$$;

-- 7) Процедура для добавления новой пластинки
CREATE OR REPLACE PROCEDURE add_new_record(
    p_label_number VARCHAR,
    p_title VARCHAR,
    p_company_id INTEGER,
    p_release_date DATE,
    p_wholesale_price DECIMAL,
    p_retail_price DECIMAL,
    p_stock_quantity INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO records (label_number, title, company_id, release_date, 
                         wholesale_price, retail_price, stock_quantity)
    VALUES (p_label_number, p_title, p_company_id, p_release_date,
            p_wholesale_price, p_retail_price, p_stock_quantity);
    
    RAISE NOTICE 'Пластинка добавлена';
END;
$$;

-- Начальные данные для тестирования

INSERT INTO musicians (name, birth_date, nationality, role) VALUES
('Иван Петров', '1980-05-15', 'Россия', 'исполнитель'),
('Мария Сидорова', '1975-08-22', 'Россия', 'дирижер'),
('Алексей Козлов', '1982-03-10', 'Россия', 'композитор'),
('Дмитрий Волков', '1978-11-30', 'Россия', 'исполнитель');

INSERT INTO instruments (name) VALUES
('Фортепиано'), ('Скрипка'), ('Виолончель'), ('Флейта');

INSERT INTO musician_instruments (musician_id, instrument_id) VALUES
(1, 1), (1, 2), (4, 3);

INSERT INTO ensembles (name, type, founded_year, leader_id) VALUES
('Московский камерный оркестр', 'оркестр', 1990, 2),
('Джаз-квартет', 'квартет', 2005, 1);

INSERT INTO ensemble_members (ensemble_id, musician_id, join_date) VALUES
(1, 1, '2010-01-15'), (1, 4, '2010-01-15'), (2, 1, '2005-06-01');

INSERT INTO compositions (title, composer_id, year_written, genre) VALUES
('Симфония №1', 3, 2010, 'классическая'),
('Джазовая сюита', 3, 2015, 'джаз');

INSERT INTO performances (composition_id, ensemble_id, performance_date, venue) VALUES
(1, 1, '2020-05-15', 'Концертный зал Чайковского'),
(2, 2, '2021-08-20', 'Клуб Алексея Козлова');

INSERT INTO record_companies (name, address, is_wholesale) VALUES
('EMI', 'Лондон, Великобритания', TRUE),
('Мелодия', 'Москва, Россия', TRUE);

INSERT INTO records (label_number, title, company_id, release_date, 
                     wholesale_price, retail_price, sold_last_year, 
                     sold_current_year, stock_quantity) VALUES
('EMI-001', 'Лучшие произведения классики', 1, '2020-01-15', 
 500.00, 750.00, 150, 200, 50),
('MEL-002', 'Джазовые вечера', 2, '2021-06-10', 
 400.00, 600.00, 100, 350, 30);

INSERT INTO record_performances (record_id, performance_id) VALUES
(1, 1), (2, 2);
