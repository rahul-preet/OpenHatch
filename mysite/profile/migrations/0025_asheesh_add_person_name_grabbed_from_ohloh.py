
from south.db import db
from django.db import models
from mysite.profile.models import *

class Migration:
    
    def forwards(self, orm):
        
        # Adding field 'Person.gotten_name_from_ohloh'
        db.add_column('profile_person', 'gotten_name_from_ohloh', models.BooleanField(default=False))
        
        # Changing field 'Person.time_record_was_created'
        db.alter_column('profile_person', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 30, 19, 58, 57, 424016)))
        
        # Changing field 'Link_Person_Tag.time_record_was_created'
        db.alter_column('profile_link_person_tag', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 30, 19, 58, 58, 27599)))
        
        # Changing field 'Link_ProjectExp_Tag.time_record_was_created'
        db.alter_column('profile_link_projectexp_tag', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 30, 19, 58, 57, 840808)))
        
        # Changing field 'Link_Project_Tag.time_record_was_created'
        db.alter_column('profile_link_project_tag', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 30, 19, 58, 57, 937712)))
        
    
    
    def backwards(self, orm):
        
        # Deleting field 'Person.gotten_name_from_ohloh'
        db.delete_column('profile_person', 'gotten_name_from_ohloh')
        
        # Changing field 'Person.time_record_was_created'
        db.alter_column('profile_person', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 29, 18, 47, 21, 124807)))
        
        # Changing field 'Link_Person_Tag.time_record_was_created'
        db.alter_column('profile_link_person_tag', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 29, 18, 47, 21, 41758)))
        
        # Changing field 'Link_ProjectExp_Tag.time_record_was_created'
        db.alter_column('profile_link_projectexp_tag', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 29, 18, 47, 20, 874875)))
        
        # Changing field 'Link_Project_Tag.time_record_was_created'
        db.alter_column('profile_link_project_tag', 'time_record_was_created', models.DateTimeField(default=datetime.datetime(2009, 6, 29, 18, 47, 21, 296188)))
        
    
    
    models = {
        'profile.person': {
            'gotten_name_from_ohloh': ('models.BooleanField', [], {'default': 'False'}),
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'interested_in_working_on': ('models.CharField', [], {'default': "''", 'max_length': '1024'}),
            'last_polled': ('models.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'last_touched': ('models.DateTimeField', [], {'null': 'True'}),
            'name': ('models.CharField', [], {'max_length': '200'}),
            'ohloh_grab_completed': ('models.BooleanField', [], {'default': 'False'}),
            'password_hash_md5': ('models.CharField', [], {'max_length': '200'}),
            'poll_on_next_web_view': ('models.BooleanField', [], {'default': 'True'}),
            'time_record_was_created': ('models.DateTimeField', [], {'default': 'datetime.datetime(2009, 6, 30, 19, 58, 59, 84981)'}),
            'username': ('models.CharField', [], {'max_length': '200'})
        },
        'profile.link_person_tag': {
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'person': ('models.ForeignKey', ["orm['profile.Person']"], {}),
            'source': ('models.CharField', [], {'max_length': '200'}),
            'tag': ('models.ForeignKey', ["orm['profile.Tag']"], {}),
            'time_record_was_created': ('models.DateTimeField', [], {'default': 'datetime.datetime(2009, 6, 30, 19, 58, 58, 588616)'})
        },
        'profile.tag': {
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'tag_type': ('models.ForeignKey', ["orm['profile.TagType']"], {}),
            'text': ('models.CharField', [], {'max_length': '50'})
        },
        'profile.link_projectexp_tag': {
            'Meta': {'unique_together': "[('tag','project_exp','source'),]"},
            'favorite': ('models.BooleanField', [], {'default': 'False'}),
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'project_exp': ('models.ForeignKey', ["orm['profile.ProjectExp']"], {}),
            'source': ('models.CharField', [], {'max_length': '200'}),
            'tag': ('models.ForeignKey', ["orm['profile.Tag']"], {}),
            'time_record_was_created': ('models.DateTimeField', [], {'default': 'datetime.datetime(2009, 6, 30, 19, 58, 58, 771680)'})
        },
        'profile.sourceforgeperson': {
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'username': ('models.CharField', [], {'max_length': '200'})
        },
        'profile.link_project_tag': {
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'project': ('models.ForeignKey', ["orm['search.Project']"], {}),
            'source': ('models.CharField', [], {'max_length': '200'}),
            'tag': ('models.ForeignKey', ["orm['profile.Tag']"], {}),
            'time_record_was_created': ('models.DateTimeField', [], {'default': 'datetime.datetime(2009, 6, 30, 19, 58, 59, 213551)'})
        },
        'profile.sourceforgeproject': {
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'unixname': ('models.CharField', [], {'max_length': '200'})
        },
        'search.project': {
            '_stub': True,
            'id': ('models.AutoField', [], {'primary_key': 'True'})
        },
        'profile.link_sf_proj_dude_fm': {
            'Meta': {'unique_together': "[('person','project'),]"},
            'date_collected': ('models.DateTimeField', [], {}),
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'is_admin': ('models.BooleanField', [], {'default': 'False'}),
            'person': ('models.ForeignKey', ["orm['profile.SourceForgePerson']"], {}),
            'position': ('models.CharField', [], {'max_length': '200'}),
            'project': ('models.ForeignKey', ["orm['profile.SourceForgeProject']"], {})
        },
        'profile.tagtype': {
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'name': ('models.CharField', [], {'max_length': '100'}),
            'prefix': ('models.CharField', [], {'max_length': '20'})
        },
        'profile.projectexp': {
            'description': ('models.TextField', [], {}),
            'favorite': ('models.BooleanField', [], {'default': '0'}),
            'id': ('models.AutoField', [], {'primary_key': 'True'}),
            'last_touched': ('models.DateTimeField', [], {'null': 'True'}),
            'man_months': ('models.PositiveIntegerField', [], {'null': 'True'}),
            'person': ('models.ForeignKey', ["orm['profile.Person']"], {}),
            'person_role': ('models.CharField', [], {'max_length': '200'}),
            'primary_language': ('models.CharField', [], {'max_length': '200', 'null': 'True'}),
            'project': ('models.ForeignKey', ["orm['search.Project']"], {}),
            'source': ('models.CharField', [], {'max_length': '100', 'null': 'True'}),
            'time_record_was_created': ('models.DateTimeField', [], {'null': 'True'}),
            'url': ('models.URLField', [], {'max_length': '200', 'null': 'True'})
        }
    }
    
    complete_apps = ['profile']
