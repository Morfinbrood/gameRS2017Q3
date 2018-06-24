# gameRS2017Q3
Final task Rolling Scope Cource 2017Q3

| Deadline  | Folder name |
|-----------|-------------|
| 23:59 15.12.2017 | game |

### Game based on JavaScript + HTML or Canvas/WebGl/SVG.

### Requirements
#### Obligatory:
  1. Any genre. Storyline around:
     * Zombie apocalypse
     * Middle Ages
     * Cosmos / Space 
  2. You can make it yourself or in a team of two.
  3. You can use any framework (e.g. https://phaser.io/)
  4. Default language is JavaScript. Usage of ES6+ features is highly welcome.
  5. Runs stably in the latest Chrome.
  6. Avaliable via a link. The simplest way is to deploy it on GitHub pages. (e.g. https://themarkmarrone.github.io/petrovich/, https://spider-shooter.github.io)
  7. Landing page containing:
      * name
      * screenshots
      * description
      * controls manual
      * additional information
  8. Presentation (in ENG/RU/BEL) should contain the following:
    * Link to the game demo
    * Parts taken by each developer
    * Most challenging issues


#### Optional:
  1. Following the Airbnb JavaScript Style Guide + eslint.
  2. Usage of Webpack
  3. User interface and landing page in English.

### Review process
1. Firstly you demonstrate your game to the mentor. This should be done at least three days before the deadline.
2. At least two games from each subgroup will be demonstrated to all our students.

#### Useful links:
1) https://habrahabr.ru/post/184666/  
2) http://opengameart.org/
3) http://robinbobin.livejournal.com/4066704.html
4) https://cdn.scratch.mit.edu/scratchr2/static/__787158ad1362201586979068ba002765__/help/ru/howto/fly-intro.html


# The Game project

Using webpack 4 to bundle all .js files into one file. Compiles new ES features with babel and its transformation runtime plugin.

### Version

1.0.0

## Install Dependencies

```bash
npm i
```

## Build

```bash
npm run build
```

## Run Dev Server

```bash
npm run start
```

### основные фичи и функциональность:
1. Проект делался как можно модульнее, гибче, с возможностью масштабирования и дополнения функционалом.
2. Продвинутая модель коллизий: Каждый объект имеет коллайдер в форме многоугольника по форме его спрайта, у танка он прямоугольный, у зомбарей сложный, у мелких объектов, включая мелких зомбарей он упрощён до круга (для оптимизации). У зомбарей большого размера по форме спрайта. Можно легко дописать, чтобы многоугольник коллайдера изменялся по форме спрайта при анимации, но нужно будет для каждого кадра анимации задать точки многоугольника. Т.е. в теории мы можем сделать так, что если монстр тянет руки и захватывает ею танк, то он не может выбраться из-за коллизий, пока тот не разожмёт руки.
2. Есть псевдофизика: У танка есть энерция и занос, при столкновении с коллизией идёт отскок, пули имееют импульс, который угасает проходя через монстров. Поэтому крупнокалиберный снаряд может пройти насквозь через много мелких монстров, прежде чем исчезнет и сразу исчезает при столкновении с базой или большим зомби.
4. При коллизии объектов танк-монстр, урон получает тот кто легче. У нас тут все монтры это один и тот же объект только с разным ХП, размером и массой. Поэтому когда танк наезжает на мелкого он наносит тому урон достаточный для убийства, при столкновении с большим монстром, танк сам подвержен раздавливанию и получает урон, так как масса того больше.
5. У снарядов есть дальность полёта, прежде чем он исчезнет. У крупнокаллиберных урон, дальность и пробивная сила, больше, у пулемёта меньше.
6. При стельбе в свою базу вы наносите ей урон.
7. Весь AI монстров заключается в том, что они в случайный промежуток времени случайно поворачиваются в небольшом диапазоне угла.
8. Есть музыка с 5 треками со случайной генерацией след трека.
