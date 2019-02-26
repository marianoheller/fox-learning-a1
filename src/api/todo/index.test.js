import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Todo } from '.'

const app = () => express(apiRoot, routes)

let todo

beforeEach(async () => {
  todo = await Todo.create({})
})

test('POST /todos 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ name: 'test', disabled: 'test', done: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.disabled).toEqual('test')
  expect(body.done).toEqual('test')
})

test('GET /todos 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /todos/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${todo.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(todo.id)
})

test('GET /todos/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /todos/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${todo.id}`)
    .send({ name: 'test', disabled: 'test', done: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(todo.id)
  expect(body.name).toEqual('test')
  expect(body.disabled).toEqual('test')
  expect(body.done).toEqual('test')
})

test('PUT /todos/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ name: 'test', disabled: 'test', done: 'test' })
  expect(status).toBe(404)
})

test('DELETE /todos/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${todo.id}`)
  expect(status).toBe(204)
})

test('DELETE /todos/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
