
from south.db import db
from django.db import models
from mysite.search.models import *

class Migration:
    
    def forwards(self, orm):
        
        # Adding field 'Project.icon_for_search_result'
        db.add_column('search_project', 'icon_for_search_result', orm['search.project:icon_for_search_result'])
        
    
    
    def backwards(self, orm):
        
        # Deleting field 'Project.icon_for_search_result'
        db.delete_column('search_project', 'icon_for_search_result')
        
    
    
    models = {
        'search.bug': {
            'canonical_bug_link': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'date_reported': ('django.db.models.fields.DateTimeField', [], {}),
            'description': ('django.db.models.fields.TextField', [], {}),
            'good_for_newcomers': ('django.db.models.fields.BooleanField', [], {'default': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'importance': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'last_polled': ('django.db.models.fields.DateTimeField', [], {}),
            'last_touched': ('django.db.models.fields.DateTimeField', [], {}),
            'people_involved': ('django.db.models.fields.IntegerField', [], {}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['search.Project']"}),
            'status': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'submitter_realname': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'submitter_username': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        'search.project': {
            'date_icon_was_fetched_from_ohloh': ('django.db.models.fields.DateTimeField', [], {'default': 'None', 'null': 'True'}),
            'icon': ('django.db.models.fields.files.ImageField', [], {'default': 'None', 'max_length': '100', 'null': 'True'}),
            'icon_for_search_result': ('django.db.models.fields.files.ImageField', [], {'default': 'None', 'max_length': '100', 'null': 'True'}),
            'icon_smaller_for_badge': ('django.db.models.fields.files.ImageField', [], {'default': 'None', 'max_length': '100', 'null': 'True'}),
            'icon_url': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        }
    }
    
    complete_apps = ['search']
