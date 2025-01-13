using Microsoft.EntityFrameworkCore;
using Phonebook.Models;

namespace Phonebook.Data
{
    public class PhonebookContext : DbContext
    {
        public PhonebookContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Contact> Contacts{ get; set; }
    }
}
