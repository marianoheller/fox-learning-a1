import { success, notFound } from '../../services/response/'
import { Todo } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Todo.create(body)
    .then((todo) => todo.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Todo.find(query, select, cursor)
    .then((todos) => todos.map((todo) => todo.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then((todo) => todo ? todo.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then((todo) => todo ? Object.assign(todo, body).save() : null)
    .then((todo) => todo ? todo.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then((todo) => todo ? todo.remove() : null)
    .then(success(res, 204))
    .catch(next)
