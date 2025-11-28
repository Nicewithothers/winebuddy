insert into grape (grape_color, grape_sweetness, grape_type, grape_growth_time)
select * from (values
                   ('WHITE', 0.25, 'CHARDONNAY', 9),
                   ('WHITE', 0.5, 'SAUVIGNON_BLANC', 9),
                   ('RED', 0.15, 'SYRAH', 9),
                   ('RED', 0, 'CABERNET_FRANC', 9),
                   ('RED', 0.1, 'CABERNET_SAUVIGNON', 9),
                   ('RED', 0.1, 'MERLOT', 9),
                   ('RED', 0.2, 'PINOT_NOIR', 9),
                   ('WHITE', 0.3, 'RIESLING', 9),
                   ('WHITE', 0.70, 'MUSCAT', 9),
                   ('RED', 0.50, 'PORTO', 9)
              ) AS data(grape_color, grape_sweetness, grape_type, grape_growth_time)
where not exists (select 1 from grape);