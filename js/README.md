# Cholopleth Map
### If GDP:
* Necessary variables: Countries, Years.
* Uses *gdp.json*.
### If Employment:
* Necessary variables: Countries, **Education level**, Years.
* Uses *Q2_total.json*.
### If Income:
* Necessary variables: Countries, **Education level**, Years.
* Uses *Q4.json*, **but** needs to sum the income of males and income of females
### If Education:
* Necessary variables: Countries, **Education level**, Years.
* Uses *Q3_total.json*.
### If Women in High Positions:
* Necessary variables: Countries, Years.
* Uses *Q6.json*, it's a derived measure of the percentage of female employees in manager senior positions.
### If Poverty Level:
* Necessary variables: Countries, **Education level**, Years.
* Uses *Q1.json*, it's a derived measure - represents an average of the level of poverty of men and women (with ages between 15-64), per level of education in a country for a certain year. This gives us information about how poverty-educational levels are related.
### If Gender Wage Gap:
* Necessary variables: Countries, **Education level**, Years.
* Uses *Q4_b.json*, it's a derived measure of the difference of income divided by the sum of the income of both sexes.