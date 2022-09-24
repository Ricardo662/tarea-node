const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks',async(req, res) => { 
  try {
    const taskld= await tasks.findAll()
    res.status(201).json(taskld)
  }catch(err){
      res.status(500).json({message:err.message})
    }
  })

// Create task
app.post('/tasks', async (req, res) => {
  const { description, done} = req.body
  if(description == null || done == null){
    res.status(400).send("os valores não estão corretos")
  }
  else{
    if(done == true || done == false){
  const newtask = await tasks.create({
    description,
    done
  })
  res.status(200).send('cadastro pronto')
  }
    else{
      res.status(400).send("o valor tem que ser : true ou false ")
    }
}

})

// Show task
app.get('/tasks/:id', async(req, res) => {


  const taskId = req.params.id

  const noTem = await tasks.findByPk(( taskId ))

  if(noTem == null) {

    return res.status(400).send ('INSERIR UM VALOR DE ID' )
  }

  try {

  res.status(200).json({ noTem })
} catch(err) {
  res.status(500).json({message: err.message})
}
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
   const { description, done } = req.body
   const task = {
     description,
     done
   }
   try {
     await tasks.update(task, { where: { id: taskId } })

    res.status(201).send(
        'registro foi atualizado'
       )
   } catch (error) {
     res.status(500).json({ error: error + ".registro errado." })
   }
 })

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  try {
    const taskToDelete = await tasks.destroy({ where: { id: taskId } })

    if (!taskToDelete) {
      res.status(422).json({ message: ' nao existe!' })
      return
    }

    res.status(200).send({
      action: 'registro apagado',
      deletedTaskId: taskId
    })
  } catch (error) {
    res.status(500).json({ error: error + ". error ..." })
  }
})


app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
