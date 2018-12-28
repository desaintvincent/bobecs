import Entity from '../src/Entity';
import ComponentFactory from '../src/ComponentFactory';
const chai      = require('chai');
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');
const expect    = chai.expect;

chai.use(sinonChai);

describe('Entity', () => {
    describe('constructor', () => {
        it('should init _id and other vars', () => {
            const e = new Entity('specialID');
            expect(e._id).to.equal('specialID');
            expect(e._tags).to.be.an('array').that.is.empty;
            expect(e._manager).to.equal(null);
            expect(e._components).to.be.an('object').that.is.empty;
        });
    });

    describe('setManager', () => {
        it('should set the manager', () => {
            const e = new Entity();
            e.setManager('patate');
            expect(e._manager).to.equal('patate');
        });
    });

    describe('addComponent', () => {
        it('should add a component', () => {
            class Component {
                constructor() {
                    this.prop = 'property';
                }
            }
            const e = new Entity();
            e.addComponent(new Component());
            expect(e._components).to.have.a.property('component');
            expect(e._components.component).to.have.a.property('prop');
        });
    });

    describe('removeComponent', () => {
        it('should remove a component', () => {
            class mycomponent {
                constructor() {
                    this.prop = 'property';
                }
            }
            const e = new Entity();
            e.addComponent(new mycomponent());
            expect(e._components).to.have.a.property('mycomponent');
            e.removeComponent('mycomponent');
            expect(e._components).to.not.have.a.property('component');
        });
    });

    describe('hasComponent', () => {
        it('should return if entity has a component', () => {
            class mycomponent {
                constructor() {
                    this.prop = 'property';
                }
            }
            const e = new Entity();
            expect(e.hasComponent('mycomponent')).to.equal(false);
            e.addComponent(new mycomponent());
            expect(e.hasComponent('mycomponent')).to.equal(true);
            expect(e.hasComponent('mycomponent2')).to.equal(false);
        });
    });

    describe('getComponent', () => {
        it('should return a component', () => {
            class mycomponent {
                constructor() {
                    this.prop = 'property';
                }
            }
            const e = new Entity();
            const c = new mycomponent();
            e.addComponent(c);
            expect(e.getComponent('mycomponent')).to.equal(c);
        });
    });

    describe('addTag', () => {
        it('should add a tag', () => {
            const e = new Entity();
            e.addTag('pizza');
            expect(e._tags).to.deep.equal(['pizza']);
            e.addTag('ananas');
            expect(e._tags).to.deep.equal(['pizza', 'ananas']);
        });
    });

    describe('removeTag', () => {
        it('should remove a tag', () => {
            const e = new Entity();
            e._tags = ['pizza', 'ananas'];
            e.removeTag('ananas');
            expect(e._tags).to.deep.equal(['pizza']);
            e.removeTag('pizza');
            expect(e._tags).to.be.empty;
        });
    });

    describe('hasTag', () => {
        it('should return if entity has a tag', () => {
            const e = new Entity();
            e._tags = ['pizza', 'ananas'];
            expect(e.hasTag('pizza')).to.equal(true);
            expect(e.hasTag('ananas')).to.equal(true);
            expect(e.hasTag('avocado')).to.equal(false);
        });
    });

    describe('remove', () => {
        it('should call the removeEntity method of the manager', () => {
            const e = new Entity();
            e._manager = {
                removeEntity: sinon.spy()
            };
            e.remove();
            expect(e._manager.removeEntity).to.have.been.calledWith(e);
        });
    });

    describe('addToSystem', () => {
        it('should call the addEntityToSystem method of the manager', () => {
            const e = new Entity();
            e._manager = {
                addEntityToSystem: sinon.spy()
            };
            e.addToSystem('systemName');
            expect(e._manager.addEntityToSystem).to.have.been.calledWith(e, 'systemName');
        });
    });

    describe('get', () => {
        it('should be shorcut of getComponent', () => {
            const e = new Entity();
            e.getComponent = sinon.spy();
            e.get('myarg');
            expect(e.getComponent).to.have.been.calledWith('myarg');
        });
    });

    describe('add', () => {
        it('should be shorcut of addComponent', () => {
            const e = new Entity();
            e.addComponent = sinon.spy();
            e.add('myarg');
            expect(e.addComponent).to.have.been.calledWith('myarg');
        });
    });

    describe('has', () => {
        it('should be shorcut of hasComponent', () => {
            const e = new Entity();
            e.hasComponent = sinon.spy();
            e.has('myarg');
            expect(e.hasComponent).to.have.been.calledWith('myarg');
        });
    });

    describe('serialize', () => {
        it('should copy components and tags', () => {
            const e = new Entity();
            class fakeComponent {
                serialize () {
                    return {
                        _foo: 'bar',
                        _bar: 'foo'
                    };
                }
            }
            e.add(new fakeComponent());
            e.addTag('foo');
            const s = e.serialize();
            expect(s).to.deep.equal({ _tags: [ 'foo' ], _components: { fakecomponent: { _foo: 'bar', _bar: 'foo' } } });
        });
    });

    describe('build', () => {
        it('should build an entity with all props in arg', () => {
            ComponentFactory.create = (name) => {
                return {
                    name,
                    build: sinon.spy()
                };
            };
            const e = new Entity();
            e.build({ _tags: [ 'foo' ], _components: { fakecomponent: { _foo: 'bar', _bar: 'foo' } } });
            expect(e._tags).to.deep.equal(['foo']);
            expect(e._components).to.have.a.property('fakecomponent');
            expect(e._components.fakecomponent.build).to.have.been.calledWith({ _foo: 'bar', _bar: 'foo' });
        });
    });

    describe('clone', () => {
        it('should clone an entity', () => {
            ComponentFactory.create = (name) => {
                return {
                    name,
                    build: sinon.spy()
                };
            };
            const e = new Entity();
            e._manager = {
                createEntity: () => {
                    return new Entity();
                }
            };
            class fakeComponent {
                serialize () {
                    return {
                        _foo: 'bar',
                        _bar: 'foo'
                    };
                }
            }
            e.add(new fakeComponent());
            e.addTag('foo');

            const e2 = e.clone();

            expect(e2._tags).to.deep.equal(['foo']);
            expect(e2._components).to.have.a.property('fakecomponent');
            expect(e2._components.fakecomponent.build).to.have.been.calledWith({ _foo: 'bar', _bar: 'foo' });
            expect(e2._id).to.not.equal(e._id);
        });
    });
});
