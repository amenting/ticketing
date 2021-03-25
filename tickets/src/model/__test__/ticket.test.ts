import { Ticket } from "../ticket";

it('implements optimistic concurrency control - occ', async (done) => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });
    
    // Save the ticket to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    
    // make two separate changes to these tickets
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }
    
    throw new Error('Should not reach this point');
});

it('version number gets incremented on multiple saves', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    // save the ticket
    await ticket.save();
    expect(ticket.version).toEqual(0);

    // save the ticket
    await ticket.save();
    expect(ticket.version).toEqual(1);
    
    // save the ticket
    await ticket.save();
    expect(ticket.version).toEqual(2);

});