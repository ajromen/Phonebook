using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Phonebook.Data;
using Phonebook.DTO;
using Phonebook.Models;

namespace Phonebook.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private PhonebookContext _context;

        public ContactsController(PhonebookContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() 
        {
            var contacts = _context.Contacts.ToList();
            return Ok(contacts);
        }

        [HttpPost]
        public IActionResult AddContacts(AddContactsDTO request)
        {
            var domainModelContact = new Contact
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Favorite = request.Favorite
            };
            _context.Contacts.Add(domainModelContact);
            _context.SaveChanges();

            return Ok(domainModelContact);
        }
    }
}
