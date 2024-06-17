"""Project package."""

from debts import containers, settings

container = containers.Container()
container.config.from_dict(settings.__dict__)
container.wire(modules=['debts.tasks'])
