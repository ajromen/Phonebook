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
            var contacts = _context.Contacts.OrderBy(c => !c.Favorite).ToList();
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

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult Delete(Guid id)
        {
            var contact = _context.Contacts.FirstOrDefault(x => x.Id == id);
            if (contact == null)
            {
                return BadRequest();
            }
            _context.Contacts.Remove(contact);
            _context.SaveChanges(true);
            return Ok();
        }

        [HttpPost("switchFavorite/{id:guid}")]
        public IActionResult SwitchFavorite(Guid id)
        {
            var contact = _context.Contacts.FirstOrDefault(x => x.Id == id);
            if (contact == null)
            {
                return BadRequest();
            }
            contact.Favorite = !contact.Favorite;
            _context.Contacts.Update(contact);
            _context.SaveChanges(true);
            return Ok();
        }
    }
}
