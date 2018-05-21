# An example application using [SwarmDB](https://github.com/gritzko/swarm) as a data-sync layer 
> and [TodoMVC](http://todomvc.com/) project as a sample.

### Run locally

Setup the project.

```bash
$ git clone git@github.com:gritzko/swarm.git
$ cd swarm && yarn
$ git clone git@github.com:olebedev/todo.git ./packages/examples/todo
$ cd ./packages/examples/todo && yarn
$ docker run -d --name swarmdb -p 31415:31415 -v `pwd`:/var/lib/swarm olebedev/swarmdb
```

Start the application by hitting `yarn start`. 
