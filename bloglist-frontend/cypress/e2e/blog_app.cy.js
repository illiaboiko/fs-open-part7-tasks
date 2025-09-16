import { Children } from "react"

describe('Blog app', function () {
  beforeEach(function () {
    // clearing database
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    // adding user
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, Cypress.env('user'))
    // visit main page
    cy.visit('')
  })

  it('Login form is shown by default', function () {
    cy.contains('blogs')
    cy.contains('log in')
  })

  describe('Login', function () {
    it('loging with wrong credentials fails', function () {
      cy.contains('log in').click()
      cy.get('#login').type('wrong user')
      cy.get('#password').type('wrong password')
      cy.get('#log-in-button').click()

      cy.contains('invalid username or password')
    })

    it('login with correct credentials succeeds', function () {
      cy.contains('log in').click()
      cy.get('#login').type('123')
      cy.get('#password').type('123')
      cy.get('#log-in-button').click()

      cy.contains('user 123 logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      console.log(Cypress.env('user'))
      cy.login(Cypress.env('user'))
    })

    it('a new blog can be added', function () {
      cy.contains('New Blog').click()
      cy.get('#title').type('testing new blog')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')

      cy.get('#createBlog').click()

      cy.get('.notification').should('contain', 'New blog added!')
      cy.contains('testing new blog by test author')
    })

    it('a blog can be liked', function () {
      cy.contains('New Blog').click()
      cy.get('#title').type('testing new blog')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')

      cy.get('#createBlog').click()

      cy.contains('view').click()
      cy.contains('like').click()

      cy.contains('1 likes')
    })

    it('a blog can be deleted by the user who created it', function () {
      cy.contains('New Blog').click()
      cy.get('#title').type('testing new blog')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')

      cy.get('#createBlog').click()

      cy.contains('view').click()
      cy.contains('delete').click()

      cy.get('html').should('not.contain', 'testing new blog')
    })
  })

  describe('Testing different users', function () {
    beforeEach('preparing users and posts', function () {
      // creating another test user
      const user = {
        username: 'test_user2',
        password: '1234',
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

      // logging in as first user and creating a blog
      cy.login(Cypress.env('user'))
      const blogObj = {
        title: 'cypress blog',
        author: '123',
        url: 'some ulr',
      }
      cy.createBlog(blogObj)
      // loggin out
      cy.logout()

      // logging in as second user
      cy.login(user)
    })

    it('non-creator of the blog cannot see the delete button', function () {
      cy.contains('view').click()
      cy.get('html').should('not.contain', 'delete')
    })
  })

  describe('testing that blogs are ordered by likes', function () {
    beforeEach(
      'creating several blogs with different number of likes',
      function () {
        cy.login(Cypress.env('user'))
        const blog1 = {
          title: 'most liked blog (10 likes)',
          author: 'cypress',
          url: 'some url',
          likes: 10,
        }

        const blog2 = {
          title: 'second most liked blog (9 likes)',
          author: 'cypress',
          url: 'some url',
          likes: 9,
        }

        cy.createBlog(blog1)
        cy.createBlog(blog2)

        cy.visit('')
      }
    )

    it('renders most liked post first when first visited', function () {
      cy.get('.all-blogs').children().eq(0).should('contain', 'most liked blog (10 likes)')
      cy.get('.all-blogs').children().eq(1).should('contain', 'second most liked blog (9 likes)')
    })

  })
})
