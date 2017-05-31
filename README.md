# EveryoneInCricket
30 May 2017
I started this project as a learning for AngularJs. I kept on putting almost all angularJs concepts into this. Anyone who wants to learn building angularApps this might be a good starting point. Bare minimum dependencies are used in this repository.
Major Focuses are on following topics.
1. Routes using ui-router
2. Smart table using filters and a global search accross whole data.
3. Use of test / fake data. So no dependency of database or web api to fetch data.
4. Dynamic Breadcrumbs.
Question: How routes are available to whole application
Answer: Routes are put into a constant, this constant is accessible to everywhere using dependency injection. This is shown below.
app.constant('routes', getRoutes()); This getRoutes function gets all routes and put them all into routes constant variable. This routes is used in controller in the same way a service is used.
function mycontroller($state, config, routes, $rootScope)